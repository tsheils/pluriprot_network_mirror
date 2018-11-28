import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {GraphDataService} from "../../force-directed-graph/graph-component/services/graph-data.service";
import {Node, Protein} from "../../force-directed-graph/graph-component/models/node";
import {Link} from "../../force-directed-graph/graph-component/models/link";
import {finalize, tap} from "rxjs/internal/operators";

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {
@Output()
  public selected: EventEmitter<Protein> = new EventEmitter();
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

  displayFn(node?: Protein): string | undefined {
    return node ? node.name : undefined;
  }


  search() {
    this.selected.emit(this.searchForm.get('typeaheadInput').value);
  }
}
