import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'truncate'
})

export class TruncatePipe implements PipeTransform {
	transform(value: string, limit: number): string {
		if(!value) return;
		if (!limit || limit < 1) return value;
		// let finalLimit = limit >= 1 &&  ? parseInt(args[0], 10) : 10;
		// let trail = args.length > 1 ? args[1] : '...';
		return value.length > limit ? value.substring(0, limit).trim() : value;
	}
}