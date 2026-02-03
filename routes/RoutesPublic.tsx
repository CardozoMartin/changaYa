import { useAuthSessionStore } from '@/store/authSessionStore';
import React from 'react'

const RoutesPublic = () => {
 const { user } = useAuthSessionStore();
    return user ? <Navigate>to="/HomeScreen" /> : <Navigate to="/LoginScreen" />;
}

export default RoutesPublic