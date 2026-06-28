import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Staff } from './pages/staff/staff';
import { Services } from './pages/services/services';
import { Availability } from './pages/availability/availability';
import { Reports } from './pages/reports/reports';
import { Calendar } from './pages/calendar/calendar';
import { WalkIn } from './pages/walk-in/walk-in';
import { Patients } from './pages/patients/patients';
import { Profile } from './pages/profile/profile';
import { Login } from './pages/login/login';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'staff', component: Staff, canActivate: [authGuard] },
    { path: 'services', component: Services, canActivate: [authGuard] },
    { path: 'availability', component: Availability, canActivate: [authGuard] },
    { path: 'reports', component: Reports, canActivate: [authGuard] },
    { path: 'calendar', component: Calendar, canActivate: [authGuard] },
    { path: 'walk-in', component: WalkIn, canActivate: [authGuard] },
    { path: 'patients', component: Patients, canActivate: [authGuard] },
    { path: 'profile', component: Profile, canActivate: [authGuard] },
];