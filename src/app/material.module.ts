import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
// import { MatErrorModule } from '@angular/material'
import { from } from "rxjs";
const modules = [
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    // MatErrorModule
]

@NgModule({
    imports: modules,
    exports: modules
})
export class MaterialModule{}