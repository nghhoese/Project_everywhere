export default class TaskItem {
  constructor({short_text, long_text, media, duration, step, media_type, progressbar_direction}) {
    this.short_text = short_text;
    this.long_text = long_text;
    this.media = media;
    this.duration = duration;
    this.step = step;
    this.media_type = media_type;
    this.progressbar_direction = progressbar_direction;
  }
}
