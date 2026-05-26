import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Expense } from '../../type/spesa';
import { SpesaService } from '../../services/spesa-service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-aggiungi-spesa',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './aggiungi-spesa.html',
  styleUrl: './aggiungi-spesa.css',
})
export class AggiungiSpesa {
 private spesaService = inject(SpesaService);
 
 protected noticeSuccessAddedExpense = signal(false);
 
 

 protected formSpesa = new FormGroup({
      importo: new FormControl<number | null>(null, [
          Validators.required, 
          Validators.min(0.01)
    ],
      ),
      title: new FormControl<string>('', [
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(3)
      ]),
      categoria: new FormControl<string>('', [
          Validators.required
        ]
      ),
      descrizione: new FormControl<string>('', [
        Validators.maxLength(30)
      ]),
      data: new FormControl<string>('', 
        [
          Validators.required
        ])
    });


    protected isInvalidField(fieldName: keyof typeof this.formSpesa.controls): boolean {
      const control = this.formSpesa.controls[fieldName];

      return control.invalid && control.touched;
    }

    protected hasFieldError(fieldName: keyof typeof this.formSpesa.controls, errorName: string): boolean {
      const control = this.formSpesa.controls[fieldName];

      return control.hasError(errorName) && control.touched;
    }
    
    protected showNoticeSuccess(): void {
      this.noticeSuccessAddedExpense.set(true);
      setTimeout(() => {
        this.noticeSuccessAddedExpense.set(false);
      },2000)
    }



    onSubmit(): void {
      if(this.formSpesa.invalid) {
        this.formSpesa.markAllAsTouched();
        return;
      }

      const valoreForm = this.formSpesa.getRawValue();

      if (!valoreForm.title ||valoreForm.importo === null || !valoreForm.categoria || !valoreForm.data) {
        return;
      }

      const nuovaSpesa: Expense = {
        id: crypto.randomUUID(),
        title: valoreForm.title,
        importo: valoreForm.importo,
        categoria: valoreForm.categoria,
        descrizione: valoreForm.descrizione ?? '',
        data: valoreForm.data
      };

      this.spesaService.addExpense(nuovaSpesa);

      this.showNoticeSuccess();


      this.formSpesa.reset({
        importo: null,
        title: '',
        categoria: '',
        descrizione: '',
        data: ''
      })
    }


}
