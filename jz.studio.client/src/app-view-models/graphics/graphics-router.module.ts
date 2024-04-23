import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GraphicsComponent } from './graphics.component';
import { GraphicsHomeComponent } from './components/graphics-home/graphics-home.component';
import { RaindomTreeViewComponent } from './views/raindom-tree-view/raindom-tree-view.component';

const routes: Routes = [
  {
    path: '',
    component: GraphicsComponent,
    children: [
      {
        path: '',
        component: GraphicsHomeComponent
      },
      {
        path: 'home',
        component: GraphicsHomeComponent
      },
      {
        path: 'tree',
        component: RaindomTreeViewComponent
      },
      //{
      //  path: 'dataviz',
      //  loadChildren: () => import('../../library/jz-dataviz/jz-dataviz.module').then(m => m.JzDatavizModule)
      //},
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GraphicsRouterModule { }
