import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs/Rx';


export class Assignment {
  constructor (
    public student: number,
    public score: number,
    public outOf: number,
    public dueDate: string,
  ) {}
}

@Injectable()
export class AssignmentService {

  private assignments: Assignment[] = [
    new Assignment(1, 0, 100, "04/21"),
    new Assignment(3, 0, 60, "04/20"),
    new Assignment(2, 0, 20, "04/15"),
    new Assignment(4, 0, 77, "04/22"),
    new Assignment(1, 0, 1022, "05/06")
  ]

  constructor() { }

  public getAssignments(): Observable<Assignment[]> {
    return Observable.from(this.assignments).toArray();
  }

}