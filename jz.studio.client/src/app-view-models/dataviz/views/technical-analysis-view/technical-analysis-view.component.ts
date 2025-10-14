import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JzTechnicalAnalysisComponent } from '../../../../library/jz-charts/jz-technical-analysis/techanJs/jz-technical-analysis.component';

@Component({
    selector: 'technical-analysis-view',
    imports: [CommonModule, JzTechnicalAnalysisComponent],
    templateUrl: './technical-analysis-view.component.html',
    styleUrl: './technical-analysis-view.component.css'
})
export class TechnicalAnalysisViewComponent {

}
