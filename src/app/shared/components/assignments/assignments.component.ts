import { Component, OnInit } from '@angular/core';
import { AssignmentService, Assignment} from '../../services/assignment/assignment.service';


@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})
export class AssignmentsComponent implements OnInit {

  private assignments: Assignment[] = []

  constructor(private assignmentService: AssignmentService) { }

  ngOnInit() {
    this.assignmentService.getAssignments().subscribe(assignments => {
      this.assignments = assignments;
    })

  }



}