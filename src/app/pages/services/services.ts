import { Component, inject, signal } from '@angular/core';
import { ServicesService } from '../../core/services/services.service';
import { ServiceDto } from '../../core/models/service.model';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  private servicesService = inject(ServicesService);

  services = signal<ServiceDto[] | null>(null); 

  ngOnInit() {
   this.servicesService.getAllServices().subscribe((res: any) => {
    this.services.set(res);
   });
  }
}
