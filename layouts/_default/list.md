{{- /* Section-hub Markdown mirror: page body plus a child index. */ -}}
{{- partial "md-page" . | htmlUnescape -}}
{{- $children := .Pages.ByWeight }}
{{- with $children }}

## Pages in this section

{{ range . }}- [{{ .Title }}]({{ .Permalink }}){{ with (or .Description (.Summary | plainify | chomp)) }} — {{ . | chomp }}{{ end }}
{{ end }}
{{- end -}}
