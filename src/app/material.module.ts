import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button'
const modules = [
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule
]

@NgModule({
    imports: modules,
    exports: modules
})
export class MaterialModule{}