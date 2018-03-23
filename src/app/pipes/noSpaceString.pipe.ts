import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'noSpaceString'
})

export class NoSpaceStringPipe implements PipeTransform {
	transform(value: string){
        if (typeof value != 'string') {
            return value;
        }
        return value.replace(/[\s]/g, '');
	}
}