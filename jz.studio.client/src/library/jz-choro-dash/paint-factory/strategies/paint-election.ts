
import { HttpErrorResponse } from "@angular/common/http";
import { Subscription } from "rxjs/internal/Subscription";
import { CountyPaintingStrategy } from "../interfaces/county-painting-strategy";
import { ChoroDataService } from "../../../jz-choropleths/services/choro-data.service";
import { CountyDataService } from "../../../jz-choropleths/services/county-data.service";

export class PaintElectionStrategy implements CountyPaintingStrategy {

  private subscription!: Subscription;
  popups = 'elections';

  constructor(
    private choroDataService: ChoroDataService,
    private countyDataService: CountyDataService,
  ) { }

  getData(popover_loading: any, popover_httperror: any, callback: (data: any) => void): void {
    // Use the choroDataService to fetch data and handle painting
    this.choroDataService.getElectionData(popover_loading, popover_httperror).subscribe(
      (responseData: any) => {
        popover_loading.isPopupVisible = false;
        callback(responseData);
      },
      (error: HttpErrorResponse) => {
        // Handle error
        popover_httperror.ok = error.ok;
        popover_httperror.message = error.message;
        popover_httperror.url = error.url;
        popover_httperror.statusText = error.statusText;
        popover_httperror.isPopupVisible = true;
        console.error('Error fetching data:', error);
      }
    );
  }

  getColor(countyFips: any): string {
    // Logic to determine color based on election data
    //console.log("Dictionary keys:", Object.keys(this.choroDataService.electionDataDictionary));
    //console.log("Access key:", String(countyFips.id));
    console.log(this.choroDataService.electionDataDictionary);
    let c = this.choroDataService.electionDataDictionary[String(countyFips.id)];
    if (c != undefined) {
      //if (c. > c.votesGop) {
        return '#00AEF3';
      //} else {
      //  return '#FF6161';
      //}
    }
    return '#507577';
  }

  paintCounties(data:any) {
    this.countyDataService.sendCountyData(data);
  }
}
