import { Github, Globe, Instagram, Linkedin, Mail, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import type { PublicProfile } from "@/types/user";

const SOCIAL_ICONS: Record<string, typeof Globe> = {
  website: Globe,
  linkedin: Linkedin,
  github: Github,
  twitter: Globe,
  instagram: Instagram,
};

export function ProfileAboutCard({ profile }: { profile: PublicProfile }) {
  const hasContact = Boolean(profile.contact?.email || profile.contact?.phone);
  const isEmpty = profile.skills.length === 0 && !hasContact && profile.socialLinks.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>About {profile.name.split(" ")[0]}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.skills.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </div>
        )}

        {hasContact && (
          <div className="space-y-1.5 text-sm text-text-secondary">
            {profile.contact?.email && (
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-text-muted" /> {profile.contact.email}
              </p>
            )}
            {profile.contact?.phone && (
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-text-muted" /> {profile.contact.phone}
              </p>
            )}
          </div>
        )}

        {profile.socialLinks.length > 0 && (
          <div className="flex gap-3">
            {profile.socialLinks.map((link) => {
              const Icon = SOCIAL_ICONS[link.platform] ?? Globe;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.platform}
                  className="text-text-muted hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}

        {isEmpty && <p className="text-sm text-text-muted">This user hasn&apos;t added profile details yet.</p>}
      </CardContent>
    </Card>
  );
}
