import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { LoadingComponent } from './components/loading/loading.component';
import { UserLookupPipe } from './pipes/user-lookup';

const pipes = [UserLookupPipe];
const components = [LoadingComponent];

const declarations = [...pipes, ...components];

@NgModule({
  declarations: declarations,
  imports: [MaterialModule],
  exports: declarations,
})
export class SharedModule {}
