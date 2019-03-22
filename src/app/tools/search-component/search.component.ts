import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {GraphDataService} from "../../force-directed-graph/graph-component/services/graph-data.service";
import {finalize, tap} from "rxjs/internal/operators";

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html',
<<<<<<< HEAD
  styleUrls: ['./search.component.scss']
=======
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.Native
>>>>>>> 203407fc605741f942d01fa2afc5855fe978a973
})

export class SearchComponent implements OnInit {
@Output()
  public selected: EventEmitter<any> = new EventEmitter();
  searchForm: FormGroup;
  options: any;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private graphDataService: GraphDataService
  ) {  }


  /**
   *add placeholder string if required
   * set up subscription for input value changes
   * // todo: should unsubscribe
   */
  ngOnInit() {
    this.searchForm = this.fb.group({
      typeaheadInput: null
    });

    this.searchForm
      .get('typeaheadInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.isLoading = true),
        switchMap(term => this.graphDataService.searchNodes(term.name ? term.name : term)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        ))
      .subscribe(res => {
        this.options = res;
      });
  }

  displayFn(node?: any): string | undefined {
    return node ? node.name : undefined;
  }


  search() {
    this.selected.emit(this.searchForm.get('typeaheadInput').value);
  }
}
