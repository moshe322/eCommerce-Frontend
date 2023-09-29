import { FormControl, ValidationErrors } from '@angular/forms';

export class WhiteSpace {
  static noSpaceAlowed(control: FormControl): ValidationErrors | null {
    if (control.value !== null && control.value.trim().length <= 1) {
      return { noSpaceAlowed: true };
    }
    return null;
  }
}
