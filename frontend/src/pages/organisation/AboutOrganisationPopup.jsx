import React from "react";
import { Popup, CopyableRow } from "../../components";
import { useTheme } from "../../context/theme";

const AboutOrganisationPopup = ({
  isOpen,
  onClose,
  organisationName = "Quantum Solutions",
}) => {
  const t = useTheme();

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={`About ${organisationName}`}
      maxWidth="720px"
    >
      <div
        style={{
          color: t.colors.textBodyDark,
          fontSize: t.font.size.sm,
          lineHeight: 1.6,
        }}
      >
        <p
          style={{
            margin: 0,
            marginBottom: t.spacing(2),
          }}
        >
          Quantum Solutions is a forward-thinking AI and software engineering
          company specializing in intelligent automation and data-driven
          enterprise solutions. Our mission is to empower organizations with
          cutting-edge technology that simplifies workflows, enhances
          collaboration, and drives measurable impact.
        </p>

        <p
          style={{
            margin: 0,
            marginBottom: t.spacing(2),
          }}
        >
          We focus on delivering scalable systems that merge human creativity
          with artificial intelligence — from machine learning integrations to
          workflow automation tools.
        </p>

        <p
          style={{
            margin: 0,
            marginBottom: t.spacing(3),
          }}
        >
          With a team of passionate engineers, designers, and data scientists,
          Quantum Solutions is redefining the way businesses operate in the
          digital era through innovation, precision, and integrity.
        </p>

        <h3
          style={{
            margin: 0,
            marginBottom: t.spacing(2),
            fontSize: t.font.size.md,
            fontWeight: t.font.weight.semiBold,
            color: t.colors.textHeadingDark,
          }}
        >
          Contact Info
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.spacing(1.5),
          }}
        >
          <CopyableRow copyValue="quantumsol@gmail.com" icon="✉">
            quantumsol@gmail.com
          </CopyableRow>

          <CopyableRow copyValue="+91 6794628751" icon="☎">
            +91 6794628751
          </CopyableRow>

          <CopyableRow
            copyValue="Neeladri Nagar, Electronic City Phase I, Electronic City, Bengaluru, Karnataka 560100, India"
            icon="📍"
            align="flex-start"
          >
            Neeladri Nagar, Electronic City Phase I
            <br />
            Electronic City, Bengaluru
            <br />
            Karnataka 560100, India
          </CopyableRow>
        </div>
      </div>
    </Popup>
  );
};

export default AboutOrganisationPopup;
