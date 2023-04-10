import projectKatakana from 'assets/katakana-project.svg?url';
import { Button } from 'components/Button';
import { Divider } from 'components/Divider';
import { Heading } from 'components/Heading';
import { deviceModels } from 'components/Model/deviceModels';
import { Section } from 'components/Section';
import { Text } from 'components/Text';
import { useTheme } from 'components/ThemeProvider';
import { Transition } from 'components/Transition';
import { useWindowSize } from 'hooks';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { cssProps, media, classes } from 'utils/style';
import styles from './ProjectSummary.module.css';

const Model = dynamic(() => import('components/Model').then(mod => mod.Model));

export const ProjectSummary = ({
  id,
  visible: sectionVisible,
  sectionRef,
  index,
  title,
  description,
  model,
  buttonText,
  buttonLink,
  alternate,
  ...rest
}) => {
  const { textures } = model;
  // console.log("MODAL", sectionRef.current);
  // console.log("ID", id, "\nSEC-REF", sectionRef, "\nIndex", index, "\nTITLE", title, "\nModel",
  //   model, "\nALT", alternate, "\nREST", rest, "VISIBLE\n", sectionVisible);
  // console.log("SEC", textures[0].srcSet[0].src);
  const [focused, setFocused] = useState(false);
  const theme = useTheme();
  const { width } = useWindowSize();
  const titleId = `${id}-title`;
  const isMobile = width <= media.tablet;
  const svgOpacity = theme.themeId === 'light' ? 0.7 : 1;
  const indexText = index < 10 ? `0${index}` : index;
  const phoneSizes = `(max-width: ${media.tablet}px) 30vw, 20vw`;
  const laptopSizes = `(max-width: ${media.tablet}px) 80vw, 40vw`;

  const renderKatakana = (device, visible) => (
    <svg
      aria-hidden="true"
      width="750"
      height="137"
      viewBox="0 0 750 137"
      data-visible={visible}
      data-light={theme.themeId === 'light'}
      style={cssProps({ opacity: svgOpacity })}
      className={styles.svg}
      data-device={device}
    >
      <use href={`${projectKatakana}#katakana-project`} />
    </svg>
  );

  const renderDetails = visible => (
    <div className={styles.details}>
      <div aria-hidden className={styles.index}>
        <Divider
          notchWidth="64px"
          notchHeight="8px"
          collapsed={!visible}
          collapseDelay={1000}
        />
        <span className={styles.indexNumber} data-visible={visible}>
          {indexText}
        </span>
      </div>
      <Heading
        level={3}
        as="h2"
        className={styles.title}
        data-visible={visible}
        id={titleId}
      >
        {title}
      </Heading>
      <Text className={styles.description} data-visible={visible} as="p">
        {description}
      </Text>
      {buttonText && (
        <div className={styles.button} data-visible={visible}>
          <Button iconHoverShift href={buttonLink} iconEnd="arrowRight">
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );

  const renderPreview = visible => (
    <div className={styles.preview}>
      {model.type === 'laptop' && (
        <>
          {renderKatakana('laptop', visible)}
          <div
            className={alternate ? classes(styles.model) : styles.model}
            data-device="laptop"
          >
            {/* {console.log("PVISIBLE", model, "VIS ", visible, "Title", title)} */}
            <button onClick={() => clickHandle(visible)}>REnder Preview</button>
            <Model
              alt={model.alt}
              cameraPosition={{ x: 0, y: 0, z: 8 }}
              showDelay={700}
              show={visible}
              models={[
                {
                  ...deviceModels.laptop,
                  texture: {
                    ...model.textures[0],
                    sizes: laptopSizes,
                  },
                },
              ]}
            />
          </div>
        </>
      )}
      {model.type === 'phone' && (
        <>
          {renderKatakana('phone', visible)}
          <div className={styles.model} data-device="phone">
            <Model
              alt={model.alt}
              cameraPosition={{ x: 0, y: 0, z: 11.5 }}
              showDelay={300}
              show={visible}
              models={[
                {
                  ...deviceModels.phone,
                  position: { x: -0.6, y: 1.1, z: 0 },
                  texture: {
                    ...model.textures[0],
                    sizes: phoneSizes,
                  },
                },
                {
                  ...deviceModels.phone,
                  position: { x: 0.6, y: -0.5, z: 0.3 },
                  texture: {
                    ...model.textures[1],
                    sizes: phoneSizes,
                  },
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );

  const clickHandle = (visible) => {
    console.log("CLICKEDD", visible);
    alert("ID " + id + "\nSEC-REF " + [{ ...sectionRef }] + "\nIndex " + index + "\nTITLE " + title + "\nModel " + textures[0].srcSet[0].src + "\nALT " + alternate + "\nREST " + rest + "\nSection " + sectionVisible + "\nVISIBLE " + visible);
  };

  // useEffect(() => {
  //   console.log("USE-EFF");
  //   clickHandle()
  // }, [])

  return (
    <Section
      className={styles.summary}
      data-alternate={alternate}
      data-first={index === 1}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      aria-labelledby={titleId}
      ref={sectionRef}
      id={id}
      tabIndex={-1}
      {...rest}
    >
      {/* <button onClick={clickHandle} styles={{ zIndex: 999 }}>Hello</button> */}
      {/* {alert("hello")} */}
      <div className={styles.content}>
        <Transition in={sectionVisible || focused}>
          {visible => (
            <>
              {/* <button onClick={clickHandle}>NEW DIVV </button> */}
              {/* {console.log("VISIBLE", visible)} */}
              {!alternate && !isMobile && (
                <>
                  {renderDetails(visible)}
                  {renderPreview(visible)}
                </>
              )}
              {(alternate || isMobile) && (
                <>
                  {renderPreview(visible)}
                  {renderDetails(visible)}
                </>
              )}
            </>
          )}
        </Transition>
      </div>
    </Section>
  );
};
