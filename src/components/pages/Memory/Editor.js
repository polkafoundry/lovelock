import React from 'react';
import Dante from 'Dante2';
import { withStyles } from '@material-ui/core/styles';
import mediumZoom from 'medium-zoom';
import Input from '@material-ui/core/Input';
import { DividerBlockConfig } from "Dante2/package/es/components/blocks/divider";
import { waitForHtmlTags } from '../../../helper'
import throttle from 'lodash/throttle'

const font =
  '"jaf-bernino-sans", "Open Sans", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif';
const styles = {
  wrapper: {
    margin: '0 auto',
    maxWidth: 740,
    padding: '0 5%',
    '@media (max-width: 768px)': {
      padding: '0 24px',
    }
  },
  titleText: {
    fontFamily: font,
    fontSize: 64.8,
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: 20,
  },
  subtitleText: {
    fontFamily: font,
    fontSize: 27,
    fontWeight: 300,
    lineHeight: 1.2,
    marginBottom: 20,
  },
};

class Editor extends React.Component {

  titleText = React.createRef();
  subtitleText = React.createRef();

  componentDidMount() {
    if (this.props.read_only) {
      waitForHtmlTags('.graf-image', mediumZoom)
      waitForHtmlTags('.sectionLayout--fullWidth', images => {
        // zoom fullsize image
        this.resizeImages(images)
        this.resizeEventHandler = throttle(() => this.resizeImages(images), 300)
        window.addEventListener('resize', this.resizeEventHandler, { passive: true })
      })
    } else {
      const titleInput = this.titleText.current;
      // for some reason, could not set this through react
      titleInput.style.letterSpacing = '-2.592px';
      titleInput.focus();

      const subtitleText = this.subtitleText.current;
      // for some reason, could not set this through react
      subtitleText.style.letterSpacing = '-0.54px';

      waitForHtmlTags('.sectionLayout--fullWidth', this.resizeImages) // resize draft images

      // resize added images
      this.resizeEventHandler = throttle(() => this.resizeImages(), 1000)
      window.addEventListener('resize', this.resizeEventHandler, { passive: true })
    }
  }

  componentWillUnmount() {
    this.resizeEventHandler && window.removeEventListener('resize', this.resizeEventHandler)
  }

  resizeImages = (images, url) => {
    images = images || document.querySelectorAll('.sectionLayout--fullWidth')
    if (!images || !images.length) return

    const dw = document.documentElement.clientWidth
    const pw = document.querySelector('.postContent').clientWidth
    images.forEach(i => {
      if (!url || i.querySelector(`img[src='${url}']`)) {
        i.style.width = dw + 'px'
        i.style.marginLeft = String((pw - dw) / 2) + 'px'
      }
    })
  }

  resetImage = url => {
    const images = document.querySelectorAll('.sectionLayout--fullWidth')
    images.forEach(i => {
      if (i.querySelector(`img[src='${url}']`)) {
        i.style.width = ''
        i.style.marginLeft = ''
      }
    })
  }

  configWidgets = () => {
    const widgets = [ ...Dante.defaultProps.widgets ];
    const imgBlock = widgets[0];

    // remove the border when item is selected in view mode
    imgBlock.selected_class = this.props.read_only ? 'is-selected' : 'is-selected is-mediaFocused';
    imgBlock.selectedFn = block => {
      const { direction, url } = block.getData().toJS()
      switch (direction) {
        case "left":
          !this.props.read_only && this.resetImage(url)
          return "graf--layoutOutsetLeft";

        case "center":
          !this.props.read_only && this.resetImage(url)
          return "";

        case "wide":
          !this.props.read_only && setTimeout(() => this.resizeImages(null, url), 100)
          return "sectionLayout--fullWidth";

        case "fill":
          !this.props.read_only && this.resetImage(url)
          return "graf--layoutFillWidth";

        default:
          return "";
      }
    }

    widgets.push(DividerBlockConfig())

    return widgets;
  };

  configTooltips = () => {
    const tips = Dante.defaultProps.tooltips;

    // remove the H1 item on format toolbar
    const toolbar = tips[3];
    toolbar.widget_options.block_types = toolbar.widget_options.block_types.filter(e => e.label !== 'h2');
    toolbar.sticky = document.documentElement.clientWidth < 1175;
    return tips;
  };

  render() {
    const { classes, saveOptions } = this.props;
    const draftStorage = saveOptions
      ? {
          data_storage: saveOptions,
        }
      : {};

    return (
      <div className={classes.wrapper}>
        {!this.props.read_only && (
          <>
            <Input
              className={classes.titleText}
              inputRef={this.titleText}
              placeholder="Title"
              value={this.props.title}
              onChange={e => this.props.onTitleChange(e.target.value)}
              fullWidth
            />
            <Input
              className={classes.subtitleText}
              inputRef={this.subtitleText}
              placeholder="Subtitle (optional)"
              value={this.props.subtitle}
              onChange={e => this.props.onSubtitleChange(e.target.value)}
              fullWidth
            />
          </>
        )}
        <Dante
          content={this.props.initContent ? this.props.initContent : null}
          read_only={!!this.props.read_only}
          body_placeholder="Write content, paste or drag & drop photos..."
          widgets={this.configWidgets()}
          tooltips={this.configTooltips()}
          {...draftStorage}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Editor);
