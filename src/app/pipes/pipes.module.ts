import { NgModule } from '@angular/core';

import { CapitalizeFirstPipe } from './capitalizefirst.pipe';
import { TruncatePipe } from './truncate.pipe';
import { NoSpaceStringPipe } from './noSpaceString.pipe';
import { LatestTagPipe } from './latestTag.pipe';
import { ObjectKeysPipe } from './objectKeys.pipe';

@NgModule({
  imports: [],
  declarations: [
  	CapitalizeFirstPipe,
    TruncatePipe,
    NoSpaceStringPipe,
    LatestTagPipe,
    ObjectKeysPipe
   ],
  exports: [
    CapitalizeFirstPipe,
    TruncatePipe,
    NoSpaceStringPipe,
    LatestTagPipe,
    ObjectKeysPipe
  ]
})

export class PipesModule {}