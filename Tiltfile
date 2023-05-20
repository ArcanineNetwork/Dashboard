
allow_k8s_contexts('do-nyc1-wolfy-tmp')

default_registry('ttl.sh/wolfy-000')
docker_build('arcanine-dashboard', '.')

k8s_yaml('k8s.yaml')

k8s_resource('arcanine-dashboard', port_forwards=3000)

local_resource(
    'kube-port-forward', 
    serve_cmd='kubectl port-forward -n kong svc/kong-proxy 8443:443',
    readiness_probe=probe(
      period_secs=15,
      http_get=http_get_action(port=443, path="/")
   )
)

