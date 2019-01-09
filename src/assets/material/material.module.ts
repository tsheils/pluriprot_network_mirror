/**
 * Created by sheilstk on 6/16/17.
 */
import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatInputModule, MatIconModule,
    MatListModule, MatSliderModule, MatProgressSpinnerModule, MatSidenavModule,
    MatCheckboxModule, MatCardModule,
    MatSelectModule, MatExpansionModule
} from '@angular/material';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatRadioModule} from '@angular/material/radio';
import {MatRippleModule} from '@angular/material/core';




@NgModule({
  imports: [
    MatButtonModule, MatAutocompleteModule, MatInputModule, MatIconModule, MatListModule, MatSliderModule,
    MatProgressSpinnerModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatCardModule, MatSelectModule,
    MatExpansionModule, DragDropModule, MatRippleModule, MatSlideToggleModule
  ],
  exports: [
    MatButtonModule, MatAutocompleteModule, MatInputModule, MatIconModule, MatListModule, MatSliderModule,
    MatProgressSpinnerModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatCardModule, MatSelectModule,
    MatExpansionModule, DragDropModule, MatRippleModule, MatSlideToggleModule
  ],
})
export class MaterialModule { }

