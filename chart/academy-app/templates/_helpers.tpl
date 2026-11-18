{{- define "academy-app.labels" -}}
app.kubernetes.io/name: academy-app
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Values.image.tag | default .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "academy-app.selector" -}}
app.kubernetes.io/name: academy-app
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
