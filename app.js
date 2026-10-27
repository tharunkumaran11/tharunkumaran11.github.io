'use strict';

const github = 'https://github.com/tharunkumaran11/';
const email = 'tharunkumaranm@outlook.com';
const architectures = {
  cloud: {
    title: 'Secure by design.<br><span>Observable by default.</span>',
    paths: ['M115 100H175', 'M285 100H345', 'M400 138V163H230V185', 'M400 138V185'],
    label: 'THREE-SERVER AWS ENVIRONMENT',
    nodes: [
      {x:5,y:63,w:110,h:75,label:'OpenVPN',sub:'SERVER 01',icon:'shield',title:'VPN-secured access',description:'OpenVPN gates access to the internal application.'},
      {x:175,y:63,w:110,h:75,label:'Upload app',sub:'SERVER 02',icon:'terminal',title:'A separate application layer',description:'A dedicated application server accepts file uploads after VPN access.'},
      {x:345,y:63,w:100,h:75,label:'Jenkins',sub:'SERVER 03 · METRICS',icon:'code',title:'Automation meets observability',description:'Jenkins routes uploads. Prometheus and Grafana monitor infrastructure metrics.'},
      {x:175,y:185,w:110,h:47,label:'Amazon S3',sub:'DOCUMENTS & IMAGES',title:'The right destination for each file',description:'Jenkins routes PDF, DOCX, XLSX, PNG and JPG uploads to Amazon S3.'},
      {x:345,y:185,w:100,h:47,label:'GitHub',sub:'CODE & CONFIG',title:'Code follows a different route',description:'Python, YAML, JSON and SQL files are routed into GitHub.'}
    ]
  },
  gitops: {
    title: 'A commit becomes<br><span>a repeatable deployment.</span>',
    paths: ['M125 68H175','M285 68H335','M390 106V145H60V174','M125 205H175','M285 205H335'],
    label:'GO APPLICATION · CI/CD & GITOPS',
    nodes:[
      {x:15,y:31,w:110,h:75,label:'GitHub',sub:'PUSH TO MAIN',icon:'github',title:'Start with version-controlled code',description:'A push to the main branch triggers the GitHub Actions workflow.'},
      {x:175,y:31,w:110,h:75,label:'Actions',sub:'TEST & BUILD',icon:'code',title:'Test before the image build',description:'Go tests run in CI before Docker builds and pushes a commit-SHA-tagged image.'},
      {x:335,y:31,w:110,h:75,label:'Docker Hub',sub:'IMAGE REGISTRY',icon:'cloud',title:'Trace each image to a commit',description:'Multi-stage Docker builds produce images tagged with the Git commit SHA.'},
      {x:15,y:174,w:110,h:65,label:'Helm in Git',sub:'DESIRED STATE',title:'Keep deployment state in Git',description:'CI updates the Helm image tag and commits the change back to GitHub.'},
      {x:175,y:174,w:110,h:65,label:'Argo CD',sub:'AUTOMATIC SYNC',title:'GitOps handles delivery',description:'Argo CD watches the repository and synchronizes Helm deployments to the cluster.'},
      {x:335,y:174,w:110,h:65,label:'Amazon EKS',sub:'APPLICATION PODS',title:'Run behind an AWS load balancer',description:'EKS runs the Go application, exposed through Ingress and an AWS ALB.'}
    ]
  },
  network: {
    title:'Know the path.<br><span>Plan for another.</span>',
    paths:['M145 65H305','M145 65Q225 5 305 65','M95 103V142H60V182','M95 142H225V182','M355 103V182'],
    label:'CISCO PACKET TRACER · SIMULATED NETWORK',
    nodes:[
      {x:45,y:28,w:100,h:75,label:'Router R1',sub:'OSPF · ROUTING',icon:'network',title:'Route between the segments',description:'Router-on-a-stick provides inter-VLAN routing; OSPF exchanges routes between R1 and R2.'},
      {x:305,y:28,w:100,h:75,label:'Router R2',sub:'PRIMARY + BACKUP',icon:'network',title:'A tested alternate route',description:'Disabling the primary routed link moved the remote route to the serial backup path.'},
      {x:10,y:182,w:100,h:53,label:'HR / Finance',sub:'VLAN 10 / 20',title:'Define the security policy',description:'ACL rules were configured for HR–Finance restrictions. End-to-end blocking still needs verification.'},
      {x:175,y:182,w:100,h:53,label:'Core switches',sub:'STP REDUNDANCY',title:'Redundant links without a loop',description:'Spanning Tree Protocol manages the redundant links between the core switches.'},
      {x:340,y:182,w:100,h:53,label:'Remote LAN',sub:'VLAN 50',title:'Verify the failure and recovery',description:'The documented lab captures serial-backup failover and restoration of the primary interface.'}
    ]
  }
};

let currentArchitecture = 'cloud';
function selectNode(index) {
  const node = architectures[currentArchitecture].nodes[index];
  document.querySelectorAll('.node-button').forEach((button,i) => {
    button.classList.toggle('active', i === index);
    button.setAttribute('aria-pressed', String(i === index));
  });
  document.getElementById('detail-index').textContent = String(index + 1).padStart(2,'0');
  document.getElementById('detail-title').textContent = node.title;
  document.getElementById('detail-description').textContent = node.description;
}

function renderArchitecture(key) {
  currentArchitecture = key;
  const model = architectures[key];
  document.getElementById('architecture-title').innerHTML = model.title;
  document.querySelectorAll('[data-architecture]').forEach(tab => {
    const selected = tab.dataset.architecture === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  document.getElementById('architecture-panel').setAttribute('aria-labelledby','tab-'+key);
  const svgNodes = model.nodes.map(node => `<g><rect class="node-bg" x="${node.x}" y="${node.y}" width="${node.w}" height="${node.h}" rx="7"/>${node.icon ? `<svg class="node-icon" x="${node.x + node.w/2 - 10}" y="${node.y + 10}" width="20" height="20"><use href="#i-${node.icon}"/></svg>` : ''}<text x="${node.x+node.w/2}" y="${node.y+(node.icon ? 46 : 22)}">${node.label}</text><text class="node-subtitle" x="${node.x+node.w/2}" y="${node.y+(node.icon ? 61 : 35)}">${node.sub}</text></g>`).join('');
  document.getElementById('architecture-diagram').innerHTML = `<svg class="diagram-svg" viewBox="0 0 450 250" aria-hidden="true"><rect class="map-boundary" x="0" y="20" width="450" height="228" rx="10"/><text class="map-label" x="12" y="13">${model.label}</text>${model.paths.map(path=>`<path class="wire" d="${path}"/><path class="wire wire-highlight" d="${path}"/>`).join('')}${svgNodes}</svg>${model.nodes.map((node,i)=>`<button class="node-button" style="left:${node.x/4.5}%;top:${node.y/2.5}%;width:${node.w/4.5}%;height:${node.h/2.5}%" aria-label="Explore ${node.label}: ${node.title}" aria-pressed="false" data-node="${i}"></button>`).join('')}`;
  document.querySelectorAll('[data-node]').forEach(button=>button.addEventListener('click',()=>selectNode(Number(button.dataset.node))));
  selectNode(0);
}
document.querySelectorAll('[data-architecture]').forEach(tab=>tab.addEventListener('click',()=>renderArchitecture(tab.dataset.architecture)));
document.querySelector('.explorer-tabs').addEventListener('keydown',event=>{
  const tabs = [...document.querySelectorAll('[data-architecture]')];
  const index = tabs.indexOf(document.activeElement);
  if(index < 0) return;
  let next;
  if(event.key === 'ArrowRight') next=(index+1)%tabs.length;
  if(event.key === 'ArrowLeft') next=(index+tabs.length-1)%tabs.length;
  if(event.key === 'Home') next=0;
  if(event.key === 'End') next=tabs.length-1;
  if(next === undefined) return;
  event.preventDefault();
  renderArchitecture(tabs[next].dataset.architecture);
  tabs[next].focus();
});
renderArchitecture('cloud');

const projects = {
  aws: {
    kicker:'01 / CLOUD · AUTOMATION · OBSERVABILITY',
    title:'AWS Secure DevOps Platform',
    summary:'A self-built, three-server AWS environment that connects secure access, file processing and operational visibility. The project simulates a production-style workflow with separate responsibilities for each server.',
    flow:'OpenVPN → Authentication → Upload application → Jenkins → Amazon S3 / GitHub',
    sections:[
      {title:'The engineering problem',text:'How can an internal upload application stay behind a VPN, route different file types automatically, and make the underlying infrastructure observable?'},
      {title:'What I built',items:['Separated the environment into a firewall/VPN and authentication server, an application upload server, and a Jenkins/monitoring server.','Used Jenkins to send document/image formats to S3 and code/configuration formats to GitHub.','Collected CPU, memory, disk and load metrics with Prometheus and Node Exporter; visualized them in Grafana.','Configured CloudWatch alarms for CPU utilization, Jenkins health and SQS backlog, with SNS email notifications.']},
      {title:'What this taught me',text:'How access controls, application workflows and monitoring depend on one another—and why a deployment needs an operational view, not just an accessible page.'}
    ],
    evidence:'The repository includes screenshots of VPN-disconnected and connected access, Jenkins routing, S3 and GitHub outputs, Prometheus targets, Grafana dashboards and alert emails.',
    tags:['AWS EC2','VPC','IAM','OpenVPN','Jenkins','S3','Prometheus','Grafana','CloudWatch','SNS','SQS'],
    repo:'aws-secure-devops-platform'
  },
  gitops:{
    kicker:'02 / CONTINUOUS INTEGRATION · GITOPS',
    title:'Go Web Application — CI/CD & GitOps',
    summary:'An end-to-end delivery workflow for a Go application, from tests and containerization to a Git-controlled deployment on Amazon EKS.',
    flow:'Git push → Go tests → Docker build → Docker Hub → Helm update in Git → Argo CD → EKS → ALB',
    sections:[
      {title:'The engineering problem',text:'How can an application change move through testing, packaging and Kubernetes delivery with a traceable version and a deployment configuration stored in Git?'},
      {title:'What I built',items:['Containerized the Go application with a multi-stage Dockerfile and tagged images with the Git commit SHA.','Configured GitHub Actions to run Go tests, build and push the image, and update the Helm image tag.','Used Helm to package the Deployment, Service and Ingress configuration.','Configured Argo CD to synchronize the repository’s desired state to EKS, separating CI from cluster delivery.','Exposed the app through Kubernetes Ingress and the AWS Load Balancer Controller.']},
      {title:'What this taught me',text:'How CI differs from continuous delivery, how GitOps gives deployment state a clear source of truth, and how image tagging ties a deployed version back to code.'}
    ],
    evidence:'The repository documents the Go application and health endpoint, tests, multi-stage image build, GitHub Actions workflow, Helm configuration and Argo CD delivery approach.',
    tags:['Go','Docker','GitHub Actions','Docker Hub','Kubernetes','Helm','Argo CD','AWS EKS','ALB'],repo:'go-web-app'
  },
  eks:{
    kicker:'03 / AWS · SERVERLESS KUBERNETES',
    title:'2048 Game on Amazon EKS',
    summary:'A deployment lab using the 2048 application to explore serverless Kubernetes compute, multi-AZ VPC networking and ingress on AWS.',
    flow:'Internet → Application Load Balancer → Kubernetes Ingress → Service → Application Pods on Fargate',
    sections:[
      {title:'The engineering problem',text:'How can a Kubernetes application run without managing EC2 worker nodes, while using an AWS-managed load balancer and a network spread across Availability Zones?'},
      {title:'What I built',items:['Deployed the application to Amazon EKS with AWS Fargate for Pod compute.','Configured five application replicas and verified all five Pods healthy in the documented deployment.','Built VPC networking with three public and three private subnets across three Availability Zones, plus Internet Gateway and NAT Gateway connectivity.','Configured the AWS Load Balancer Controller with IAM roles for service accounts (IRSA) to provision an internet-facing ALB.']},
      {title:'What this taught me',text:'How EKS, Fargate, service discovery and ingress fit together, and why healthy Pods are only one part of a reachable application.'}
    ],
    evidence:'The repository includes the running game, architecture, deployment configuration and evidence of the Kubernetes and AWS environment. The game is the sample workload; the infrastructure deployment is my project.',
    tags:['AWS EKS','Fargate','Kubernetes','VPC','ALB','IRSA'],repo:'eks-2048-fargate-project'
  },
  network:{
    kicker:'04 / CISCO PACKET TRACER · NETWORK LAB',
    title:'Secure & Resilient Enterprise Network',
    summary:'A simulated enterprise network exploring departmental segmentation, dynamic routing, security policy configuration and resilient paths.',
    flow:'Department VLANs → 802.1Q trunk → Router-on-a-stick → OSPF → Remote network',
    sections:[
      {title:'The engineering problem',text:'How do departmental networks communicate through defined routes, avoid Layer 2 loops, and keep a remote route available when the primary routed link fails?'},
      {title:'What I configured and tested',items:['Designed departmental VLANs and inter-VLAN routing using router-on-a-stick.','Configured OSPF between two routers, with a serial backup path.','Disabled the primary routed interface and documented the remote route switching to the serial next hop; then restored the primary interface.','Used STP across redundant core-switch links and checked spanning-tree state.','Configured an extended ACL intended to restrict HR–Finance traffic while permitting other traffic.']},
      {title:'A precise view of the evidence',text:'The captured evidence supports routed-link failover, restoration and internal-server connectivity. The ACL entries are documented, but successful end-to-end HR–Finance blocking is not conclusively demonstrated and needs separate verification.'},
      {title:'What this taught me',text:'Configuration and verified behavior are different things. Failure tests, route inspection and honest documentation are part of the engineering work.'}
    ],
    evidence:'Configuration references, a test-results document and screenshots cover topology, OSPF neighbors, STP, backup routing and connectivity. This is a Packet Tracer simulation, not a production network.',
    tags:['Cisco Packet Tracer','VLANs','802.1Q','OSPF','ACLs','STP','TCP/IP'],repo:'secure-resilient-enterprise-network'
  }
};
const dialog=document.getElementById('project-dialog');
let previousFocus=null;
function openProject(key){
  const project=projects[key];
  previousFocus=document.activeElement;
  document.getElementById('modal-content').innerHTML=`<p class="modal-kicker">${project.kicker}</p><h2 class="modal-title" id="modal-title">${project.title}</h2><p class="modal-summary">${project.summary}</p><div class="project-tags">${project.tags.map(tag=>`<span>${tag}</span>`).join('')}</div><div class="modal-flow" aria-label="Project architecture flow">${project.flow}</div>${project.sections.map(section=>`<section class="modal-section"><h3>${section.title}</h3>${section.text?`<p>${section.text}</p>`:`<ul>${section.items.map(item=>`<li>${item}</li>`).join('')}</ul>`}</section>`).join('')}<div class="modal-evidence"><strong>Explore the evidence.</strong> ${project.evidence}</div><div class="modal-links"><a class="button button-primary" href="${github+project.repo}" target="_blank" rel="noopener noreferrer">View repository <svg class="icon"><use href="#i-github"/></svg></a><a class="button button-outline" href="${github+project.repo}/blob/main/README.md" target="_blank" rel="noopener noreferrer">Read documentation <svg class="icon"><use href="#i-external"/></svg></a></div><p class="modal-note">Independent hands-on project. Evidence reflects the documented build; cloud resources may be stopped.</p>`;
  dialog.showModal();
  document.body.classList.add('modal-open');
  dialog.scrollTop=0;
  document.getElementById('close-dialog').focus();
}
document.querySelectorAll('[data-open-project]').forEach(button=>button.addEventListener('click',()=>openProject(button.dataset.openProject)));
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;
  const box=dialog.getBoundingClientRect();
  if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');previousFocus?.focus();});

document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
  let count=0;
  document.querySelectorAll('.project-card').forEach(card=>{
    const shown=filter==='all'||card.dataset.categories.split(' ').includes(filter);
    card.hidden=!shown;
    if(shown)count++;
  });
  document.getElementById('filter-count').textContent=`SHOWING ${String(count).padStart(2,'0')} PROJECT${count===1?'':'S'}`;
}));

const menuButton=document.querySelector('.menu-toggle');
const mobileNav=document.getElementById('mobile-nav');
function closeMenu(){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');}
menuButton.addEventListener('click',()=>{
  const open=menuButton.getAttribute('aria-expanded')!=='true';
  mobileNav.hidden=!open;
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
});
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileNav.hidden){closeMenu();menuButton.focus();}});
window.matchMedia('(min-width: 701px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

let copyTimer;
document.getElementById('copy-email').addEventListener('click',async()=>{
  const status=document.getElementById('copy-status');
  clearTimeout(copyTimer);
  try{
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    status.textContent='Email copied';
  }catch{
    status.textContent='Select the email address to copy it.';
    const range=document.createRange();range.selectNodeContents(document.querySelector('.email-row>a'));
    const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
  }
  copyTimer=setTimeout(()=>status.textContent='',5000);
});
document.getElementById('year').textContent=String(new Date().getFullYear());

if('IntersectionObserver' in window){
  const navigation=document.querySelectorAll('.desktop-nav>a');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      navigation.forEach(link=>{
        if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    });
  },{rootMargin:'-15% 0px -60% 0px',threshold:0});
  document.querySelectorAll('main>section[id]').forEach(section=>observer.observe(section));
}
