/**
 * Created by sheilstk on 6/16/17.
 */
import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatAutocompleteModule, MatMenuModule, MatToolbarModule, MatInputModule, MatIconModule,
    MatListModule, MatSliderModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatSidenavModule,
    MatSlideToggleModule, MatRadioModule, MatCheckboxModule, MatTabsModule, MatCardModule, MatTooltipModule,
    MatSelectModule, MatExpansionModule, MatDividerModule
} from '@angular/material';
import {MatChipsModule} from '@angular/material/chips';
import {DragDropModule} from '@angular/cdk/drag-drop';



@NgModule({
  imports: [MatButtonModule, MatAutocompleteModule, MatMenuModule, MatToolbarModule,
    MatInputModule, MatIconModule, MatListModule, MatSliderModule, MatProgressSpinnerModule,
    MatTableModule, MatSortModule, MatSidenavModule, MatSlideToggleModule, MatRadioModule,
      MatDividerModule, MatTabsModule, MatCheckboxModule, MatCardModule, MatTooltipModule,
      MatSelectModule, MatExpansionModule, MatChipsModule, DragDropModule],
  exports: [MatButtonModule, MatAutocompleteModule, MatMenuModule, MatToolbarModule,
    MatInputModule, MatIconModule, MatListModule, MatSliderModule, MatProgressSpinnerModule,
    MatTableModule, MatSortModule, MatSidenavModule, MatSlideToggleModule, MatRadioModule,
      MatDividerModule, MatTabsModule, MatCheckboxModule, MatCardModule, MatTooltipModule,
      MatSelectModule, MatExpansionModule, MatChipsModule, DragDropModule],
})
export class MaterialModule { }

