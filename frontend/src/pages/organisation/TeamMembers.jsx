import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import { TeamMemberCard } from "../../components";
import { useTheme } from "../../context/theme";
import RemoveMemberPopup from "./RemoveMemberPopup";
import InviteMemberPopup from "./InviteMemberPopup";

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Jane Doe",
    role: "Project Manager",
    activeProjects: 5,
    status: "active",
    avatarBg: "#22c55e",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Lead Developer",
    activeProjects: 8,
    status: "active",
    avatarBg: "#f97316",
  },
  {
    id: 3,
    name: "David Lee",
    role: "UI/UX Designer",
    activeProjects: 3,
    status: "pending",
    avatarBg: "#3b82f6",
  },
  {
    id: 4,
    name: "Emily Ray",
    role: "Marketing Specialist",
    activeProjects: 2,
    status: "inactive",
    avatarBg: "#ef4444",
  },
];

const OrganisationTeamMembers = () => {
  const t = useTheme();
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState(TEAM_MEMBERS);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const organisationName = "Quantum Solutions";

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) => {
      const haystack = `${member.name} ${member.role}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery, members]);

  const handleRequestRemove = (member) => {
    setMemberToRemove(member);
  };

  const handleCancelRemove = () => {
    setMemberToRemove(null);
  };

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      setMembers((prev) => prev.filter((m) => m.id !== memberToRemove.id));
    }
    setMemberToRemove(null);
  };

  const handleOpenInvite = () => setIsInviteOpen(true);
  const handleCancelInvite = () => setIsInviteOpen(false);
  const handleConfirmInvite = (emails) => {
    // TODO: Wire to backend invite API.
    // eslint-disable-next-line no-console
    const list = Array.isArray(emails) ? emails : [emails].filter(Boolean);
    console.log("Invite member:", { organisationId: id, emails: list });
    setIsInviteOpen(false);
  };

  const renderMemberCard = (member) => {
    return (
      <TeamMemberCard
        key={member.id}
        member={member}
        onRemove={() => handleRequestRemove(member)}
      />
    );
  };

  return (
    <OrganisationLayout
      organisationName={organisationName}
      primaryActionLabel="+ Add Member"
      onPrimaryAction={handleOpenInvite}
      searchPlaceholder="Search team members..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: t.spacing(4),
          alignItems: "stretch",
        }}
      >
        {filteredMembers.map((member) => renderMemberCard(member))}
      </div>
      <RemoveMemberPopup
        isOpen={!!memberToRemove}
        onCancel={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        memberName={memberToRemove?.name}
      />
      <InviteMemberPopup
        isOpen={isInviteOpen}
        onCancel={handleCancelInvite}
        onConfirm={handleConfirmInvite}
      />
    </OrganisationLayout>
  );
};

export default OrganisationTeamMembers;
