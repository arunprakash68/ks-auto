import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'latestTag'
})

export class LatestTagPipe implements PipeTransform {
	transform(value){

        function timeDiff(date2) { 
            let date1 = new Date().getTime()
            let diff = date1 - date2;
     
            let daysDiff = Math.floor(diff/1000/60/60/24);
            diff -= daysDiff*1000*60*60*24
     
            let hoursDiff = Math.floor(diff/1000/60/60);
            diff -= hoursDiff*1000*60*60

            return {day : daysDiff, hr : hoursDiff}
        }

        let date2 = value*1000;
        let diff = timeDiff(date2)

        if(diff.day < 1){
            if(diff.hr < 1){
                return 'new'
            }
        }
        return null
	}
}