import { NgModule } from '@angular/core';
import { UserLookupPipe } from './pipes/user-lookup';

const declarations = [UserLookupPipe];

@NgModule({
  declarations: declarations,
  imports: [],
  exports: declarations,
})
export class SharedModule {}
