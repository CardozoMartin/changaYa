# -*- coding: utf-8 -*-

from odoo import _, http, fields
from odoo.http import request
from odoo.exceptions import AccessError


class PaymentTermPortalController(http.Controller):
    
    @http.route(['/my/orders/<int:order_id>/select_payment_term'], 
                type='http', auth="public", website=True, methods=['POST'])
    def select_payment_term(self, order_id, payment_term_id, access_token=None, **kwargs):
        """Cambia el plan de pago seleccionado"""
        try:
            # Buscar la orden
            order = request.env['sale.order'].sudo().browse(order_id)
            
            if not order.exists():
                return request.redirect('/my/orders')
            
            # Verificar el token si existe
            if access_token and order.access_token != access_token:
                return request.redirect('/my/orders')
            
            # Solo cambiar si esta en borrador o enviada
            if order.state in ('draft', 'sent') and payment_term_id:
                order.write({'payment_term_id': int(payment_term_id)})
            
            # Volver a la pagina de la orden
            url = f'/my/orders/{order_id}'
            if access_token:
                url += f'?access_token={access_token}'
            
            return request.redirect(url)
            
        except Exception:
            return request.redirect('/my/orders')
    
    @http.route(['/my/orders/<int:order_id>/update_payment_term'],
                type='json', auth="public", website=True, methods=['POST'])
    def update_payment_term(self, order_id, term_id, access_token=None, **kwargs):
        try:
            # Validar que el término de pago existe
            if not term_id or term_id == '':
                return {
                    'success': False,
                    'error': 'Debe seleccionar un término de pago válido'
                }
            
            # Si selecciona el plan personalizado (-1), no hacemos nada (mantiene el actual)
            if str(term_id) == '-1':
                 return {
                    'success': True,
                    'message': 'Mantenido plan personalizado'
                }

            term_id = int(term_id)

            order_sudo = request.env['sale.order'].sudo().browse(order_id)

            if not order_sudo.exists():
                return {
                    'success': False,
                    'error': 'La orden de venta no existe'
                }

            if access_token:
                if order_sudo.access_token != access_token:
                    return {
                        'success': False,
                        'error': 'Token de acceso inválido'
                    }
            else:
                try:
                    order_sudo.check_access_rights('write')
                    order_sudo.check_access_rule('write')
                except AccessError:
                    return {
                        'success': False,
                        'error': 'No tiene permisos para modificar esta orden'
                    }
            if order_sudo.state not in ('draft', 'sent'):
                return {
                    'success': False,
                    'error': 'La orden no puede ser modificada en su estado actual'
                }
            payment_term = request.env['account.payment.term'].sudo().browse(term_id)
            if not payment_term.exists():
                return {
                    'success': False,
                    'error': 'El término de pago seleccionado no existe'
                }

            order_sudo.write({
                'payment_term_id': term_id
            })
            if hasattr(order_sudo, '_compute_expected_date'):
                order_sudo._compute_expected_date()

            return {
                'success': True,
                'message': 'Término de pago actualizado correctamente'
            }

        except ValueError:
            return {
                'success': False,
                'error': 'ID de término de pago inválido'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Error al actualizar el término de pago: {str(e)}'
            }

    @http.route(['/my/orders/<int:order_id>/get_payment_term_installments'],
                type='json', auth="public", website=True, methods=['POST'])
    def get_payment_term_installments(self, order_id, term_id, access_token=None, **kwargs):
        try:
            order_sudo = request.env['sale.order'].sudo().browse(order_id)
            if not order_sudo.exists():
                return {'error': 'Sale order not found'}

            if access_token and order_sudo.access_token != access_token:
                return {'error': 'Invalid access token'}

            if not term_id or term_id == '':
                return {'success': True, 'installments': []}

            payment_term = request.env['account.payment.term'].sudo().browse(int(term_id))
            if not payment_term.exists():
                return {'error': 'Payment term not found'}

            amount = order_sudo.amount_total
            result = []
            currency = order_sudo.currency_id
            for line in payment_term.line_ids.sorted(key=lambda r: r.id):
                if line.value == 'fixed':
                    amount -= line.value_amount
                    result.append((line, line.value_amount))
                elif line.value == 'percent':
                    amount_line = currency.round(order_sudo.amount_total * line.value_amount / 100)
                    amount -= amount_line
                    result.append((line, amount_line))
                elif line.value == 'balance':
                    result.append((line, currency.round(amount)))

            # format the installments for JSON response
            formatted_installments = []
            for line, amount_to_pay in result:
                final_amount = amount_to_pay * (1 + line.interest_rate / 100) * (1 - line.discount_rate / 100)
                formatted_installments.append({
                    'amount': currency.round(final_amount),
                    'interest_rate': line.interest_rate,
                    'discount_rate': line.discount_rate,
                })

            return {'success': True, 'installments': formatted_installments, 'currency': order_sudo.currency_id.name}
        except Exception as e:
            return {'error': str(e)}

    @http.route(['/my/contract/<int:order_id>'], type='http', auth="public", website=True)
    def portal_contract_view(self, order_id, access_token=None, **kwargs):
        order_sudo = request.env['sale.order'].sudo().browse(order_id)
        if not order_sudo.exists():
             return request.redirect('/my')
             
        if access_token and order_sudo.access_token != access_token:
             return request.redirect('/my')
        if not access_token:
            try:
                order_sudo.check_access_rights('read')
                order_sudo.check_access_rule('read')
            except AccessError:
                return request.redirect('/my')

        values = {
            'sale_order': order_sudo,
            'page_name': 'contract',
        }
        return request.render("insurance_api.portal_contract_page", values)

    @http.route(['/my/contract/<int:order_id>/sign'], type='json', auth="public", website=True, methods=['POST'])
    def portal_contract_sign(self, order_id, access_token=None, name=None, signature=None):
        order_sudo = request.env['sale.order'].sudo().browse(order_id)
        if not order_sudo.exists():
            return {'error': _('Order not found')}

        if access_token and order_sudo.access_token != access_token:
             return {'error': _('Invalid access token')}
        if not access_token:
            try:
                order_sudo.check_access_rights('write')
                order_sudo.check_access_rule('write')
            except AccessError:
                 return {'error': _('Access Denied')}

        if not signature:
            return {'error': _('Signature is missing')}

        order_sudo.write({
            'contract_signature': signature,
            'contract_signed_by': name,
            'contract_signed_on': fields.Datetime.now(),
        })
        return {'force_refresh': True, 'redirect_url': f'/my/contract/{order_id}?access_token={order_sudo.access_token}'}