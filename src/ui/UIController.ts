import katex from 'katex';
import { SegmentDefinition } from '../scene/AnimationSystem';
import { getElement } from '../utils/dom';

export class UIController {
  private titleEl = getElement<HTMLHeadingElement>('#segment-title');
  private bodyEl = getElement<HTMLParagraphElement>('#segment-body');
  private formulaContainer = getElement<HTMLDivElement>('#formula-container');
  private formulaCaption = getElement<HTMLParagraphElement>('#formula-caption');
  private progressFill = getElement<HTMLDivElement>('#progress-fill');
  private progressLabel = getElement<HTMLSpanElement>('#progress-label');
  private componentList = getElement<HTMLDivElement>('#component-list');
  private formulaToggle = getElement<HTMLButtonElement>('#formula-toggle');

  constructor(
    private segments: SegmentDefinition[],
    private onComponentSelect: (id: string) => void
  ) {
    this.formulaToggle.addEventListener('click', () => {
      this.formulaContainer.classList.toggle('is-visible');
    });
  }

  bindControls(handlers: {
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onReset: () => void;
    onSpeedChange: (speed: number) => void;
  }) {
    getElement<HTMLButtonElement>('#play-btn').addEventListener('click', handlers.onPlayPause);
    getElement<HTMLButtonElement>('#next-btn').addEventListener('click', handlers.onNext);
    getElement<HTMLButtonElement>('#prev-btn').addEventListener('click', handlers.onPrev);
    getElement<HTMLButtonElement>('#reset-btn').addEventListener('click', handlers.onReset);
    getElement<HTMLSelectElement>('#speed-select').addEventListener('change', (event) => {
      const value = Number((event.target as HTMLSelectElement).value);
      handlers.onSpeedChange(value);
    });
  }

  setComponentList(items: { id: string; nameCN: string; nameEN: string }[]) {
    this.componentList.innerHTML = '';
    items.forEach((item) => {
      const button = document.createElement('button');
      button.textContent = `${item.nameCN} / ${item.nameEN}`;
      button.addEventListener('click', () => this.onComponentSelect(item.id));
      this.componentList.appendChild(button);
    });
  }

  updateSegment(segment: SegmentDefinition) {
    this.titleEl.textContent = `${segment.titleCN} / ${segment.titleEN}`;
    this.bodyEl.textContent = `${segment.bodyCN} ${segment.bodyEN}`;
    this.formulaContainer.innerHTML = '';
    katex.render(segment.formula, this.formulaContainer, { throwOnError: false });
    this.formulaCaption.textContent = `${segment.formulaCaptionCN} ${segment.formulaCaptionEN}`;
  }

  updateProgress(progress: number, currentIndex: number, total: number) {
    this.progressFill.style.width = `${progress * 100}%`;
    this.progressLabel.textContent = `Segment ${currentIndex + 1}/${total}`;
  }

  setPlayState(isPlaying: boolean) {
    const button = getElement<HTMLButtonElement>('#play-btn');
    button.textContent = isPlaying ? 'Pause' : 'Play';
  }
}
