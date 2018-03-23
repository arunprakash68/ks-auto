import { NgModule } from '@angular/core';

import { CapitalizeFirstPipe } from './capitalizefirst.pipe';
import { TruncatePipe } from './truncate.pipe';
import { NoSpaceStringPipe } from './noSpaceString.pipe';

@NgModule({
  imports: [],
  declarations: [
  	CapitalizeFirstPipe,
    TruncatePipe,
    NoSpaceStringPipe
   ],
  exports: [
    CapitalizeFirstPipe,
    TruncatePipe,
    NoSpaceStringPipe
  ]
})

export class PipesModule {}