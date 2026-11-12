import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

/**
 * Avviso fisso in cima ai contenuti mentre `environment.maintenance` è attivo.
 * Il testo è statico di proposito: il backend è proprio ciò che non risponde.
 */
@Component({
  selector: 'app-maintenance-banner',
  templateUrl: './maintenance-banner.html',
  styleUrl: './maintenance-banner.css',
})
export class MaintenanceBanner {
  protected readonly active = environment.maintenance;
}
