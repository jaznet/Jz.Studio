import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartType } from '../../enums/chart-type';
import { PanelAttributes } from '../../interfaces/panel-interfaces';
import { ChartCrosshairService } from '../../services/interactions/chart-crosshair.service';
import { PanelPreferenceService } from '../../support/panel-workspace/panel-preference.service';
import { BaseChartComponent } from './base-chart.component';

@Component({
  selector: 'test-base-chart',
  standalone: true,
  template: ''
})
class TestBaseChartComponent extends BaseChartComponent {
  protected createChart(_: string): void {}
  protected drawYAxes(_: PanelAttributes, __: unknown): void {}
}

describe('BaseChart indicator menu', () => {
  let component: TestBaseChartComponent;
  let fixture: ComponentFixture<TestBaseChartComponent>;
  let crosshairService: ChartCrosshairService;
  let panelPreferenceService: PanelPreferenceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestBaseChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestBaseChartComponent);
    component = fixture.componentInstance;
    component.preferenceId = 'slot-1';
    component.chartType = ChartType.VOLUME;
    crosshairService = TestBed.inject(ChartCrosshairService);
    panelPreferenceService = TestBed.inject(PanelPreferenceService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('opens the menu and hides the crosshair', () => {
    const hide = spyOn(crosshairService, 'hide');

    component.toggleIndicatorMenu(menuEvent());

    expect(component.indicatorMenuOpen).toBeTrue();
    expect(hide).toHaveBeenCalled();
  });

  it('closes when another panel announces that its menu opened', () => {
    component.indicatorMenuOpen = true;

    document.body.dispatchEvent(new CustomEvent('indicator-menu-opened', {
      bubbles: true
    }));

    expect(component.indicatorMenuOpen).toBeFalse();
  });

  it('stays open when its own host announces that the menu opened', () => {
    component.indicatorMenuOpen = true;

    fixture.nativeElement.dispatchEvent(new CustomEvent('indicator-menu-opened', {
      bubbles: true
    }));

    expect(component.indicatorMenuOpen).toBeTrue();
  });

  it('closes on an outside pointer action or Escape', () => {
    component.indicatorMenuOpen = true;
    document.dispatchEvent(new Event('pointerdown'));
    expect(component.indicatorMenuOpen).toBeFalse();

    component.indicatorMenuOpen = true;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.indicatorMenuOpen).toBeFalse();
  });

  it('closes and assigns the selected indicator', () => {
    const assign = spyOn(panelPreferenceService, 'assignIndicator');
    component.indicatorMenuOpen = true;

    component.selectIndicator(menuEvent(), ChartType.ADX);

    expect(component.indicatorMenuOpen).toBeFalse();
    expect(assign).toHaveBeenCalledOnceWith('slot-1', ChartType.ADX);
  });
});

function menuEvent(): Event {
  return new Event('click', { cancelable: true, bubbles: true });
}
