import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-friend-detail',
  templateUrl: './friend-detail.component.html',
  styleUrls: ['./friend-detail.component.css']
})
export class FriendDetailComponent {
  @Input() friend: any;
  @Output() close = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<FriendDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private sanitizer: DomSanitizer
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  getAvatar(friend: any): SafeUrl {
    return friend.avatar ? this.getSafeUrlBackEnd(friend.avatar) : this.getSafeUrlBackEnd('uploads/default-avatar.png');
  }

  getSafeUrlBackEnd(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:3000/" + url);
  }
}
