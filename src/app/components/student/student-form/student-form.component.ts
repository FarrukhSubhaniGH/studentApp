import { Course } from './../../../models/course';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import { StudentService } from './../../../services/student.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  courses: Course[] = [];
  studentId: number;

  studentForm = new FormGroup({
    name: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    class: new FormControl('', Validators.required),
    section: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    courseId: new FormControl('', Validators.required)
  });

  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.getCourses();
    if (this.route.snapshot.paramMap.get('id')) {
      this.studentId = +this.route.snapshot.paramMap.get('id');
      this.getStudent();
    }
  }

  getCourses() {
    this.courseService.getCourses().subscribe((res) => {
      this.courses = res;
    });
  }

  onSubmit() {
    this.studentId ? this.editStudent() : this.addStudent();
  }

  addStudent() {
    this.studentService.addStudent(this.studentForm.value).subscribe((res) => {
      alert('Student Added Successfully!');
      this.router.navigate(['/students']);
    });
  }

  getStudent() {
    this.studentService.getStudent(this.studentId).subscribe({
      next: (student: any) => {
        this.studentForm.setValue({
          name: student.name,
          age: student.age,
          class: student.class,
          section: student.section,
          address: student.address,
          courseId: student.courseId
        });
      }
    });
  }

  editStudent() {
    this.studentService.editStudent(this.studentForm.value, this.studentId).subscribe((res) => {
      if (res) {
        alert('Student Updated Successfully!');
        this.router.navigate(['/students']);
      }
    });
  }
}
