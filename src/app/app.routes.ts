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

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'staff', component: Staff },
    { path: 'services', component: Services },
    { path: 'availability', component: Availability },
    { path: 'reports', component: Reports },
    { path: 'calendar', component: Calendar },
    { path: 'walk-in', component: WalkIn },
    { path: 'patients', component: Patients },
    { path: 'profile', component: Profile },
];