import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-income',
  imports: [ReactiveFormsModule],
  templateUrl: './add-income.html',
  styleUrl: './add-income.css',
})
export class AddIncome {
  protected incomeForm = new FormGroup({
    income: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0.01)
    ])
  });

 /* protected isInvalidField(fieldName: keyof typeof this.incomeForm.controls): boolean {

  }*/
}
