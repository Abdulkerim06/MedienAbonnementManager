import {Component, OnInit} from '@angular/core';
import {Provider} from '../../interfaces/provider';
import {ProviderService} from '../../services/provider-service';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-providers',
  imports: [
    FormsModule,
    DatePipe,
    NgForOf
  ],
  templateUrl: './providers.html',
  styleUrl: './providers.css'
})
export class ProvidersComponent implements OnInit {

  providers: Provider[] = [];

  newProviderName = '';
  newEndDate = '';

  constructor(private providerService: ProviderService) {}

  ngOnInit(): void {
    this.providers = this.providerService.getProviders();
  }

  addProvider(): void {
    if (!this.newProviderName || !this.newEndDate) return;

    this.providerService.addProvider(
      this.newProviderName,
      new Date(this.newEndDate)
    );

    this.newProviderName = '';
    this.newEndDate = '';
  }
}
