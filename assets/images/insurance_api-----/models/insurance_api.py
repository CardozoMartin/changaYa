# -*- coding: utf-8 -*-

from odoo import _, api, fields, models
from num2words import num2words


class AccountPaymentTermLine(models.Model):
    _inherit = 'account.payment.term.line'

    installment_number = fields.Integer(string="Número de Cuota", default=1)
    interest_rate = fields.Float(string='Tasa de Interés (%)', digits='Discount', default=0.0)
    discount_rate = fields.Float(string='Tasa de Descuento (%)', digits='Discount', default=0.0)
    due_date = fields.Date(
        string='Fecha de Vencimiento Fija',
        help='Si se especifica, esta fecha fija se usará en lugar del cálculo basado en días. '
             'Deje vacío para usar el cálculo automático basado en los días configurados.'
    )


class AccountPaymentTerm(models.Model):
    _inherit = 'account.payment.term'


class InsuranceSaleOrder(models.Model):
    _inherit = 'sale.order'
    policy_number = fields.Char(string="Número de Póliza", default='', readonly=False, tracking=True, copy=False,
                                store=True)
    school_year = fields.Char(string="Período Lectivo", default='', readonly=False, tracking=True, copy=False,
                              store=True)
    insurer = fields.Char(string="Aseguradora", default='Mercantil Andina Cia. de Seguros', readonly=False,
                          tracking=True, copy=False, store=True)
    insured_amount = fields.Float(string="Suma Asegurada", default=0.0, readonly=False, tracking=True, copy=False,
                                  store=True)
    events_limit = fields.Float(string="Límite por evento", default=0.100, readonly=False, tracking=True, copy=False,
                                store=True)
    in_itinere_limit = fields.Float(string="Límite in itinere", default=0.010, readonly=False, tracking=True,
                                    copy=False, store=True)
    events_max_quantity = fields.Integer(string="Cantidad máxima de eventos", default=3, readonly=False, tracking=True,
                                         copy=False, store=True)
    in_itinere_max_quantity = fields.Integer(string="Cantidad de eventos in itinere", default=10, readonly=False,
                                             tracking=True, copy=False, store=True)
    emergencies = fields.Boolean(string="Con Emergencias", default=True, readonly=False,
                                 tracking=True, copy=True, store=True)
    contract_start_date = fields.Date(string="Fecha de Inicio del Contrato", tracking=True, copy=False,
                                      help="Fecha de inicio de la vigencia del contrato")
    contract_end_date = fields.Date(string="Fecha de Fin del Contrato", tracking=True, copy=False,
                                    help="Fecha de finalización de la vigencia del contrato")
    assistance_limit = fields.Float(string="Límite total de Asistencia médica", readonly=False, default=0.5,
                                    store=True, tracking=True, copy=False, help="Límite total para asistencia médica")
    in_itinere_plural_limit = fields.Float(string="Límite In Itinere Pluralidad", readonly=False, default=0.03,
                                           store=True, tracking=True, copy=False,
                                           help="Límite para in itinere pluralidad")
    contract_sign_date = fields.Date(string="Fecha Firma del Contrato", compute='_compute_contract_sign_date',
                                     store=True, readonly=False,
                                     tracking=True, copy=False, default=lambda self: fields.Date.context_today(self),
                                     help="Fecha en que se firmó el contrato. Se obtiene de signed_on o contract_signed_on si existe.")
    show_insurance_table = fields.Boolean(string="Mostrar Tabla de Formas de pago", default=True, readonly=False,
                                          tracking=True, copy=True, store=True)

    # representante legal
    legal_representative_name = fields.Char(string="Nombre del Representante Legal", tracking=True)
    legal_representative_dni = fields.Char(string="DNI del Representante Legal", tracking=True)

    # Campos para la firma digital del contrato (separado de la orden de venta)
    contract_signature = fields.Binary(string="Firma del Contrato", copy=False, attachment=True)
    contract_signed_by = fields.Char(string="Firmado por (Contrato)", copy=False)
    contract_signed_on = fields.Datetime(string="Firmado el (Contrato)", copy=False)
    signature_thumb = fields.Image(related="contract_signature", max_width=150, max_height=75)

    # obtener fecha de la firma del contrato
    @api.depends('signed_on', 'contract_signed_on')
    def _compute_contract_sign_date(self):
        """Obtiene la fecha de firma del contrato desde signed_on o contract_signed_on"""
        for order in self:
            if order.signed_on:
                order.contract_sign_date = order.signed_on.date()
            elif order.contract_signed_on:
                order.contract_sign_date = order.contract_signed_on.date()
            else:
                order.contract_sign_date = False

    # Nombre de los campos en pesos
    def _amount_to_words(self, amount):

        amount = amount or 0
        words = num2words(amount, lang='es')
        return words.upper() + " PESOS"


    payment_schedule_lines = fields.One2many(
        'sale.order.payment.schedule.line',
        'order_id',
        string="Líneas de Cronograma de Pagos",
        readonly=True,
        states={'draft': [('readonly', False)], 'sent': [('readonly', False)]}
    )

    payment_schedule_total = fields.Monetary(
        string='Total del Cronograma',
        compute='_compute_payment_schedule_total',
        store=True,
        currency_field='currency_id',
        help='Suma total de todas las cuotas con interés y descuento aplicados'
    )

    @api.depends('payment_schedule_lines.amount')
    def _compute_payment_schedule_total(self):
        """Calcula el total real de todas las cuotas"""
        for order in self:
            order.payment_schedule_total = sum(order.payment_schedule_lines.mapped('amount'))

    @api.onchange('payment_term_id')
    def _onchange_payment_term_id(self):
        """Regenera automáticamente el cronograma cuando cambia el término de pago"""
        self._generate_payment_schedule_lines()

    def get_payment_summary(self):
        """
        Genera un resumen del plan de pagos para el reporte impreso.
        Si hay término de pago, devuelve su nombre.
        Si es manual, devuelve formato: 'Abona X cuotas (DD/MM/DD/MM) Desc X% / Int X%'
        """
        self.ensure_one()

        # 1. Si hay término de pago seleccionado, usamos su nombre
        if self.payment_term_id:
            return self.payment_term_id.display_name

        # 2. Si no, construimos el string personalizado basado en las cuotas
        lines = self.payment_schedule_lines.sorted('installment_number')
        if not lines:
            return ""

        count = len(lines)

        # Formatear fechas DD/MM/YYYY
        dates = []
        for line in lines:
            if line.due_date:
                dates.append(line.due_date.strftime('%d/%m/%Y'))
        dates_str = ", ".join(dates)

        # Obtener interés o descuento de la primera cuota
        first_line = lines[0]
        extra_info = ""

        if first_line.discount_rate > 0:
            extra_info = f" Descuento {first_line.discount_rate:g}%"
        elif first_line.interest_rate > 0:
            extra_info = f" Interés {first_line.interest_rate:g}%"

        return f"Abona en {count} cuotas ({dates_str}){extra_info}"

    def action_preview_contract(self):
        """Abre la vista de portal del contrato para compartir o firmar"""
        self.ensure_one()
        self._check_contract_requirements()
        return {
            'type': 'ir.actions.act_url',
            'url': self.get_contract_portal_url(),
            'target': 'new',
        }
    

    def _check_contract_requirements(self):
        """Valida que los campos necesarios para el contrato estén completos"""
        for order in self:
            missing = []
            if not order.legal_representative_dni:
                missing.append("DNI del Representante Legal")

            if missing:
                raise models.ValidationError(
                    "Para generar el contrato, debe completar los siguientes campos obligatorios:\n- " + "\n- ".join(
                        missing)
                )

    def get_contract_portal_url(self):
        """Genera la URL del contrato con token de acceso"""
        self.ensure_one()
        if not self.access_token:
            self._portal_ensure_token()
        return f'/my/contract/{self.id}?access_token={self.access_token}'
    

    # Acción para enviar el email con el contrato

    def action_send_contract_email(self):
        """Abre el asistente de correo con la plantilla pre-cargada"""
        self.ensure_one()
        template = self.env.ref('insurance_api.email_contract_signature', raise_if_not_found=False)
        if not template:
            raise ValidationError(_('No se encontró la plantilla de email: insurance_api.email_contract_signature'))

        # Abrimos el asistente de composición de correo
        ctx = {
            'default_model': 'sale.order',
            'default_res_ids': self.ids,
            'default_use_template': bool(template),
            'default_template_id': template.id,
            'default_composition_mode': 'comment',
            'mark_so_as_sent': True,
            'force_email': True,
        }
        return {
            'type': 'ir.actions.act_window',
            'view_mode': 'form',
            'res_model': 'mail.compose.message',
            'views': [(False, 'form')],
            'view_id': False,
            'target': 'new',
            'context': ctx,
        }
    







    ############

    def write(self, vals):
        """Override write para regenerar cronograma cuando cambia payment_term_id o amount_total"""
        # Si hay cambios manuales en las líneas (comando 1: update, o comando 0: create sin 5: clear),
        # forzamos la desvinculación del término de pago para evitar sobrescrituras.
        if 'payment_schedule_lines' in vals and 'payment_term_id' not in vals:
            commands = vals['payment_schedule_lines']
            # Comandos de edición manual: 0 (create), 1 (update), 2 (delete), 3 (unlink)
            has_updates = any(c[0] in (1, 2, 3) for c in commands)
            has_clearing = any(c[0] == 5 for c in commands)
            # Si hay updates/deletes o (creaciones sin borrado total), asumimos edición manual
            if has_updates or (not has_clearing and any(c[0] == 0 for c in commands)):
                vals['payment_term_id'] = False

        res = super(InsuranceSaleOrder, self).write(vals)

        if 'payment_term_id' in vals or 'amount_total' in vals:
            for order in self:
                order._generate_payment_schedule_lines()

        return res

    @api.model
    def create(self, vals):
        """Override create para generar cronograma al crear la orden"""
        order = super(InsuranceSaleOrder, self).create(vals)

        if order.payment_term_id and order.amount_total > 0:
            order._generate_payment_schedule_lines()

        return order

    @api.constrains('payment_schedule_lines')
    def _check_payment_schedule_total(self):
        """
        Valida que el total de las cuotas coincida con el total esperado.
        Se ejecuta solo cuando se guarda la orden, no al editar cuotas individuales.
        """
        for order in self:
            if not order.payment_schedule_lines or not order.payment_term_id:
                continue

            total_esperado = order.payment_schedule_lines[0]._calcular_total_esperado(order)
            total_actual = sum(order.payment_schedule_lines.mapped('amount'))
            diferencia = abs(total_actual - total_esperado)

            if diferencia > 0.01:
                if total_actual > total_esperado:
                    raise models.ValidationError(
                        f"El total de las cuotas (${total_actual:,.2f}) excede el monto a pagar.\n"
                        f"Total a pagar: ${total_esperado:,.2f}\n"
                        f"Excedente: ${total_actual - total_esperado:,.2f}"
                    )
                else:
                    raise models.ValidationError(
                        f"El total de las cuotas (${total_actual:,.2f}) es menor al monto a pagar.\n"
                        f"Total a pagar: ${total_esperado:,.2f}\n"
                        f"Faltante: ${total_esperado - total_actual:,.2f}"
                    )

    def _generate_payment_schedule_lines(self):
        """
        Genera o regenera las líneas de cronograma de pagos.
        Este método es compatible con onchange, create y write.
        """
        self.ensure_one()

        # Si no hay término de pago seleccionado, no regeneramos (mantenemos las cuotas manuales)
        if not self.payment_term_id:
            return

        commands = [(5, 0, 0)]

        if self.payment_term_id and self.amount_total > 0:
            # --- Calculation logic ---
            installment_number = 1
            amount = self.amount_total
            result = []

            base_date = self.date_order.date() if self.date_order else fields.Date.context_today(self)

            for line in self.payment_term_id.line_ids.sorted(key=lambda r: r.installment_number):
                if line.value == 'percent':
                    amount_line = self.currency_id.round(self.amount_total * line.value_amount / 100)
                    amount -= amount_line
                    result.append((line, amount_line))
                elif line.value == 'balance':
                    result.append((line, self.currency_id.round(amount)))
                elif line.value == 'fixed':
                    amount -= line.value_amount
                    result.append((line, line.value_amount))

            from dateutil.relativedelta import relativedelta

            for term_line, base_amount in result:

                interest_factor = (1 + term_line.interest_rate / 100)
                discount_factor = (1 - term_line.discount_rate / 100)
                final_amount = base_amount * interest_factor * discount_factor

                if term_line.due_date:

                    due_date = term_line.due_date
                else:

                    if term_line.delay_type == 'days_after':
                        due_date = base_date + relativedelta(days=term_line.nb_days)
                    elif term_line.delay_type == 'days_after_end_of_month':
                        due_date = base_date + relativedelta(day=31, days=term_line.nb_days)
                    elif term_line.delay_type == 'days_after_end_of_next_month':
                        due_date = base_date + relativedelta(months=1, day=31, days=term_line.nb_days)
                    else:

                        due_date = base_date + relativedelta(days=term_line.nb_days)

                vals = {
                    'installment_number': installment_number,
                    'amount': self.currency_id.round(final_amount),
                    'due_date': due_date,
                    'payment_status': 'pending',
                    'interest_rate': term_line.interest_rate,
                    'discount_rate': term_line.discount_rate,
                    'is_auto_generated': True,
                }
                commands.append((0, 0, vals))
                installment_number += 1

        self.payment_schedule_lines = commands

    def _create_invoices(self, grouped=False, final=False, date=None):
        """
        Override para agregar línea de intereses/descuentos financieros a la factura
        basado en la diferencia entre el total del pedido y el total del cronograma.
        """
        moves = super(InsuranceSaleOrder, self)._create_invoices(grouped=grouped, final=final, date=date)

        for move in moves:
            # Buscamos la orden de venta relacionada a esta factura
            # Nota: invoice_origin es un char, puede ser confuso si hay agrupamiento, 
            # pero _create_invoices standard vincula line_ids.sale_line_ids.order_id

            related_orders = move.invoice_line_ids.mapped('sale_line_ids.order_id')

            # Si hay múltiples órdenes agrupadas, la lógica de intereses se complica.
            # Asumimos 1 factura = 1 orden para simplificar el cálculo financiero del módulo.
            if len(related_orders) == 1:
                order = related_orders[0]

                # Calcular diferencia financiera
                # Total esperado según cronograma (con intereses)
                schedule_total = order.payment_schedule_total
                # Total original de productos (sin intereses)
                order_total = order.amount_total

                diff = schedule_total - order_total

                # Si la diferencia es significativa (> 0.01 o < -0.01)
                if abs(diff) > 0.01:
                    # Buscamos un producto para asignar la cuenta contable correcta
                    # Intenta buscar "Interés Financiero" o crea una línea genérica

                    product_name = "Interés Financiero" if diff > 0 else "Descuento Financiero"
                    product = self.env['product.product'].search([('name', '=', product_name)], limit=1)

                    line_vals = {
                        'move_id': move.id,
                        'name': f"Ajuste Financiero: {product_name}",
                        'quantity': 1,
                        'price_unit': diff,  # Puede ser negativo para descuentos
                        'display_type': 'product',
                    }

                    if product:
                        line_vals['product_id'] = product.id
                        line_vals['tax_ids'] = [(6, 0, product.taxes_id.ids)]
                        # La cuenta se obtiene automáticamente del producto al crear el move.line si se pasa product_id
                    else:
                        # Fallback: Usar cuenta de ingresos de la compañía si no hay producto
                        # Esto es riesgoso si la compañía no tiene cuenta por defecto bien configurada
                        journal = move.journal_id
                        account = journal.default_account_id or self.env.company.account_journal_payment_debit_account_id
                        if not account:
                            # Intento final: buscar cualquier cuenta de ingresos
                            account = self.env['account.account'].search([
                                ('account_type', '=', 'income'),
                                ('company_id', '=', self.env.company.id)
                            ], limit=1)

                        if account:
                            line_vals['account_id'] = account.id

                    # Crear la línea en la factura
                    self.env['account.move.line'].create(line_vals)

        return moves

    def _create_invoices(self, grouped=False, final=False, date=None):
        """
        Override para agregar línea de intereses/descuentos financieros a la factura
        basado en la diferencia entre el total del pedido y el total del cronograma.
        """
        moves = super(InsuranceSaleOrder, self)._create_invoices(grouped=grouped, final=final, date=date)

        for move in moves:
            # Buscamos la orden de venta relacionada a esta factura
            # Nota: invoice_origin es un char, puede ser confuso si hay agrupamiento, 
            # pero _create_invoices standard vincula line_ids.sale_line_ids.order_id

            related_orders = move.invoice_line_ids.mapped('sale_line_ids.order_id')

            # Si hay múltiples órdenes agrupadas, la lógica de intereses se complica.
            # Asumimos 1 factura = 1 orden para simplificar el cálculo financiero del módulo.
            if len(related_orders) == 1:
                order = related_orders[0]

                # Calcular diferencia financiera
                # Total esperado según cronograma (con intereses)
                schedule_total = order.payment_schedule_total
                # Total original de productos (sin intereses)
                order_total = order.amount_total

                diff = schedule_total - order_total

                # Si la diferencia es significativa (> 0.01 o < -0.01)
                if abs(diff) > 0.01:
                    # Buscamos un producto para asignar la cuenta contable correcta
                    # Intenta buscar "Interés Financiero" o crea una línea genérica

                    product_name = "Interés Financiero" if diff > 0 else "Descuento Financiero"
                    product = self.env['product.product'].search([('name', '=', product_name)], limit=1)

                    line_vals = {
                        'move_id': move.id,
                        'name': f"Ajuste Financiero: {product_name}",
                        'quantity': 1,
                        'price_unit': diff,  # Puede ser negativo para descuentos
                        'display_type': 'product',
                    }

                    if product:
                        line_vals['product_id'] = product.id
                        line_vals['tax_ids'] = [(6, 0, product.taxes_id.ids)]
                        # La cuenta se obtiene automáticamente del producto al crear el move.line si se pasa product_id
                    else:
                        # Fallback: Usar cuenta de ingresos de la compañía si no hay producto
                        # Esto es riesgoso si la compañía no tiene cuenta por defecto bien configurada
                        journal = move.journal_id
                        account = journal.default_account_id or self.env.company.account_journal_payment_debit_account_id
                        if not account:
                            # Intento final: buscar cualquier cuenta de ingresos
                            account = self.env['account.account'].search([
                                ('account_type', '=', 'income'),
                                ('company_id', '=', self.env.company.id)
                            ], limit=1)

                        if account:
                            line_vals['account_id'] = account.id

                    # Crear la línea en la factura
                    self.env['account.move.line'].create(line_vals)

        return moves


class SaleOrderPaymentScheduleLine(models.Model):
    _name = 'sale.order.payment.schedule.line'
    _description = 'Línea de Cronograma de Pagos'
    _order = 'installment_number'

    order_id = fields.Many2one('sale.order', string="Orden de Venta", required=True, ondelete='cascade')
    installment_number = fields.Integer(string="Número de Cuota", required=True)
    amount = fields.Float(string="Monto", required=True, digits=(16, 2))
    due_date = fields.Date(string="Fecha de Vencimiento", help="Fecha en la que vence esta cuota")
    payment_status = fields.Selection([
        ('pending', 'Pendiente'),
        ('paid', 'Pagado'),
        ('overdue', 'Vencido')
    ], string="Estado de Pago", default='pending')
    notes = fields.Text(string="Notas")
    currency_id = fields.Many2one('res.currency', related='order_id.currency_id', readonly=True)
    interest_rate = fields.Float(string='Tasa de Interés (%)', digits='Discount', default=0.0)
    discount_rate = fields.Float(string='Tasa de Descuento (%)', digits='Discount', default=0.0)
    is_auto_generated = fields.Boolean(string="Es Auto Generado", default=False, store=False)

    @api.onchange('amount', 'due_date', 'interest_rate', 'discount_rate')
    def _onchange_manual_edit(self):
        """Si se edita una cuota manualmente, desvinculamos el término de pago"""
        if self.is_auto_generated:
            self.is_auto_generated = False

        if self.order_id.payment_term_id:
            self.order_id.payment_term_id = False

    base_amount = fields.Float(
        string='Monto Base',
        compute='_compute_base_amount',
        store=True,
        digits=(16, 2),
        help='Monto sin interés ni descuento'
    )
    interest_amount = fields.Float(
        string='Monto de Interés',
        compute='_compute_interest_amount',
        store=True,
        digits=(16, 2),
        help='Monto adicional por interés'
    )
    discount_amount = fields.Float(
        string='Monto de Descuento',
        compute='_compute_discount_amount',
        store=True,
        digits=(16, 2),
        help='Descuento aplicado'
    )

    @api.depends('amount')
    def _compute_base_amount(self):
        """Calcula el monto base (sin interés ni descuento)"""
        for line in self:
            if line.interest_rate or line.discount_rate:
                interest_factor = (1 + line.interest_rate / 100)
                discount_factor = (1 - line.discount_rate / 100)
                line.base_amount = line.amount / (interest_factor * discount_factor) if (
                                                                                                    interest_factor * discount_factor) > 0 else 0
            else:
                line.base_amount = line.amount

    @api.onchange('interest_rate', 'discount_rate')
    def _onchange_rates(self):
        """Recalcula el monto cuando cambian las tasas, manteniendo el monto base."""
        for line in self:
            # Usamos base_amount si existe, para recalcular amount
            if line.base_amount:
                interest_factor = (1 + line.interest_rate / 100)
                discount_factor = (1 - line.discount_rate / 100)
                line.amount = line.currency_id.round(
                    line.base_amount * interest_factor * discount_factor) if line.currency_id else line.base_amount * interest_factor * discount_factor

    @api.depends('base_amount', 'interest_rate')
    def _compute_interest_amount(self):
        """Calcula el monto de interés"""
        for line in self:
            line.interest_amount = line.base_amount * (line.interest_rate / 100)

    @api.depends('base_amount', 'discount_rate')
    def _compute_discount_amount(self):
        """Calcula el monto de descuento"""
        for line in self:
            amount_with_interest = line.base_amount * (1 + line.interest_rate / 100)
            line.discount_amount = amount_with_interest * (line.discount_rate / 100)

    @api.constrains('amount')
    def _check_amount_positive(self):
        """Valida que cada cuota tenga un monto mayor a cero"""
        for line in self:
            if line.amount <= 0:
                raise models.ValidationError(
                    f"La cuota #{line.installment_number} debe tener un monto mayor a cero."
                )

    def _calcular_total_esperado(self, order):
        """
        Calcula el total esperado de las cuotas según el término de pago,
        aplicando los porcentajes de interés y descuento configurados.
        """
        if not order.payment_term_id or order.amount_total <= 0:
            return order.amount_total

        payment_term = order.payment_term_id
        amount = order.amount_total
        result = []

        for term_line in payment_term.line_ids.sorted(key=lambda r: r.installment_number):
            if term_line.value == 'percent':
                amount_line = order.currency_id.round(order.amount_total * term_line.value_amount / 100)
                amount -= amount_line
                result.append((term_line, amount_line))
            elif term_line.value == 'balance':
                result.append((term_line, order.currency_id.round(amount)))
            elif term_line.value == 'fixed':
                amount -= term_line.value_amount
                result.append((term_line, term_line.value_amount))

        total_esperado = 0
        for term_line, base_amount in result:
            interest_factor = (1 + term_line.interest_rate / 100)
            discount_factor = (1 - term_line.discount_rate / 100)
            final_amount = base_amount * interest_factor * discount_factor
            total_esperado += order.currency_id.round(final_amount)

        return total_esperado
