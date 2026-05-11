import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ResumeBundle } from "@/lib/public-content";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 20, marginBottom: 4, fontWeight: "bold" },
  headline: { fontSize: 12, color: "#444", marginBottom: 12 },
  section: { marginTop: 14 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 6 },
  body: { lineHeight: 1.5, marginBottom: 8 },
  role: { fontWeight: "bold", marginTop: 6 },
  meta: { fontSize: 9, color: "#666", marginBottom: 4 },
  skill: { fontSize: 10, marginBottom: 2 },
});

export function ResumePdfDocument({ bundle }: { bundle: ResumeBundle }) {
  const { headline, summary } = bundle.version.content ?? {};

  return (
    <Document title={bundle.version.title} author="Portfolio CMS">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{bundle.version.title}</Text>
        {headline ? <Text style={styles.headline}>{headline}</Text> : null}
        {summary ? (
          <Text style={styles.body}>{summary}</Text>
        ) : null}

        {bundle.experience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {bundle.experience.map((ex) => (
              <View key={ex.id} wrap={false}>
                <Text style={styles.role}>
                  {ex.role_title} · {ex.company}
                </Text>
                <Text style={styles.meta}>
                  {ex.start_date ?? "?"} — {ex.end_date ?? "Present"}
                  {ex.location ? ` · ${ex.location}` : ""}
                </Text>
                {ex.description ? <Text style={styles.body}>{ex.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {bundle.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {bundle.skills.map((sk) => (
              <Text key={sk.id} style={styles.skill}>
                {sk.category ? `${sk.category}: ` : ""}
                {sk.name}
                {sk.proficiency ? ` (${sk.proficiency})` : ""}
              </Text>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
