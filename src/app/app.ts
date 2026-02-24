import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  /**
   * premiumAmount
   */
  protected premiumAmount = 5000;

  /**
   * isProcessing
   */
  protected isProcessing = false;

  /**
   * finalAmount
   */
  protected finalAmount: number | null = null;

  /**
   * 
   * @param zone 
   * @param cdr 
   */
  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) { }

  /**
   * payPremium   * Simulates a heavy processing task using a Web Worker to avoid blocking the UI thread.
   * The worker simulates a delay of 3 seconds to mimic heavy processing and then returns the premium amount as the result.
   * The main thread listens for the worker's response and updates the final amount accordingly, while also managing the processing state.
   */
  protected payPremium(): void {
    console.log('Button clicked');
    this.isProcessing = true;

    const workerCode = `
    console.log('Worker script loaded');

    self.onmessage = function(event) {
      console.log('Worker received:', event.data);

      setTimeout(() => {
        console.log('Worker sending response');
        self.postMessage('Payment Successful for ₹' + event.data);
      }, 3000);
    };
  `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));

    worker.onmessage = (event) => {
      console.log('Main thread received:', event.data);
      this.isProcessing = false;
      this.finalAmount = event.data;
      this.cdr.detectChanges();
      localStorage.setItem('policyStatus', 'Paid');
      localStorage.setItem('lastPayment', this.premiumAmount.toString());
      worker.terminate();
    };

    worker.onerror = (err) => {
      console.error('Worker error:', err);
      this.isProcessing = false;
      worker.terminate();
    };

    worker.postMessage(this.premiumAmount);
  }
}

