import { NgModule } from '@angular/core';

import { CapitalizeFirstPipe } from './capitalizefirst.pipe';
import { TruncatePipe } from './truncate.pipe';
import { NoSpaceStringPipe } from './noSpaceString.pipe';
import { LatestTagPipe } from './latestTag.pipe';

@NgModule({
  imports: [],
  declarations: [
  	CapitalizeFirstPipe,
    TruncatePipe,
    NoSpaceStringPipe,
    LatestTagPipe
   ],
  exports: [
    CapitalizeFirstPipe,
    TruncatePipe,
    NoSpaceStringPipe,
    LatestTagPipe
  ]
})

export class PipesModule {}