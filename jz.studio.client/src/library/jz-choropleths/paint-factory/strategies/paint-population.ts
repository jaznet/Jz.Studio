
import { HttpErrorResponse } from "@angular/common/http";
import { CountyPaintingStrategy } from "../interfaces/county-painting-strategy";
import { ChoroDataService } from "../../../jz-choropleths/services/choro-data.service";
import { CountyDataService } from "../../../jz-choropleths/services/county-data.service";

export class PaintPopulationStrategy implements CountyPaintingStrategy {

  popups = 'population';

  constructor(
    private choroDataService: ChoroDataService,
    private countyDataService: CountyDataService
  ) { }

  getData(popover_loading: any, popover_httperror: any, callback: (data: any) => void): void {
    this.choroDataService.getPopulationData(popover_loading, popover_httperror).subscribe(
      (responseData: any) => {
        popover_loading.isPopupVisible = false;
        console.log('Data received:', responseData);
        callback(responseData);
      },
      (error: HttpErrorResponse) => {
        popover_httperror.ok = error.ok;
        popover_httperror.message = error.message;
        popover_httperror.url = error.url;
        popover_httperror.statusText = error.statusText;
        popover_httperror.isPopupVisible = true;
        console.error('Error fetching data:', error);
      }
    );
  }


  getColor(countyFips: any): any {
     if (!this.choroDataService.isPopulationDataFetched) {
      //this.choroDataService.getPopulationData()
      return 'yellow';
     } else {

         let c = this.choroDataService.populationDataDictionary[String(countyFips.id)];
         if (c != undefined) {
           if (c.popestimate > 100000) {
             return '#890620';
           } else {
             return '#d8d78f';
           }
         }
    }

    return 'pink';
         // Logic to determine color based on election data
    //if (!this.choroDataService.isPopulationDataFetched) {
    ////  this.getData()
    //}
    //else {
    //  let c = this.choroDataService.populationDataDictionary[String(countyFips.id)];
    //  if (c != undefined) {
    //    if (c.popestimate > 100000) {
    //      return '#890620';
    //    } else {
    //      return '#d8d78f';
    //    }
    //  }
    //  else {
    //    return 'pink';
    //  }
    //}
  }

  paintCounties(data: any) {
    this.countyDataService.sendCountyData(data);
  }


}
