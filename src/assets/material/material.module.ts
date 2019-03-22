/**
 * Created by sheilstk on 6/16/17.
 */
import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatAutocompleteModule, MatInputModule, MatIconModule, MatSliderModule, MatProgressSpinnerModule,
  MatSidenavModule, MatCheckboxModule, MatExpansionModule
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';





@NgModule({
  imports: [MatButtonModule, MatAutocompleteModule, MatInputModule, MatIconModule, MatSliderModule, MatSlideToggleModule,
    MatProgressSpinnerModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatExpansionModule, DragDropModule],
  exports: [MatButtonModule, MatAutocompleteModule, MatInputModule, MatIconModule, MatSliderModule, MatSlideToggleModule,
    MatProgressSpinnerModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatExpansionModule, DragDropModule]
})
export class MaterialModule { }

