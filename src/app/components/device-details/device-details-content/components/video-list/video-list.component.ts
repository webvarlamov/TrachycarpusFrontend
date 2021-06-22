import { Component, OnInit } from '@angular/core';
import { HttpDataProviderService} from "../../../../../http/http-data-provider.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {VideoContentModel} from "../../../../../store/video-content/model/VideoContent";

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {
  public videoList$: Observable<Array<VideoContentModel & { thumbnailURL?: string }>> = this.httpDataProviderService.getVideoContentList().pipe(
    map(videoContentList => {
      return videoContentList.map(item => {
        if (item.videoContentOwnerType === 'YOUTUBE') {
          return {...item, thumbnailURL: `https://img.youtube.com/vi/${this.getYoutubeVideoId(item.sourceURL)}/0.jpg`}
        }
        return {...item}
      })
    })
  )

  public get colSize(): string {
    return "fd-col--3"
  };

  constructor(
    public httpDataProviderService: HttpDataProviderService
  ) { }

  ngOnInit(): void {
  }

  public getYoutubeVideoId(sourceURL: string) {
    return sourceURL.split("/").reverse()[0];
  }

  public playButtonClick(videoContent: VideoContentModel) {

  }
}
