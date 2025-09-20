from diagrams import Diagram, Cluster, Edge
from diagrams.onprem.client import User, Client
from diagrams.programming.framework import FastAPI, React, Vercel, Spring
from diagrams.onprem.database import PostgreSQL
from diagrams.saas.communication import Twilio
from diagrams.aws.compute import EC2
from diagrams.aws.storage import S3
from diagrams.generic.device import Mobile
from diagrams.aws.network import APIGateway

with Diagram("AyushSync Microservice Architecture", show=False, direction="TB"):

    # User
    user = User("Practitioner / User")

    # User Interfaces
    with Cluster("User Interfaces"):
        cli = Client("AyushCLI")
        web = React("AyushWebsite (React)")
        mobile = Mobile("AyushApp (Future)")

    # Core Services
    with Cluster("Core Services"):
        sync_api = FastAPI("AyushSync API (Gateway)")

    # AyushAuth Service (Vercel)
    with Cluster("AyushAuth Service (Vercel)"):
        auth_api = FastAPI("AyushAuth API")
        db = PostgreSQL("Supabase DB (Users, OTPs)")
        sms = Twilio("Twilio SMS API")
        vercel = Vercel("Vercel Deployment")

        auth_api >> Edge(label="Stores/Retrieves User Data") >> db
        auth_api >> Edge(label="Sends OTP") >> sms
        auth_api >> Edge(label="Hosted on") >> vercel

    # ConceptMapping Service (AWS)
    with Cluster("ConceptMapping Service (AWS)"):
        concept_api = Spring("ConceptAPI (Code Mapping)")
        data_files = S3("Data Sources (.csv, .xls)")
        aws_ec2 = EC2("AWS EC2 Instance")
        icd_api = APIGateway("ICD-11 API")

        concept_api >> Edge(label="Reads Data From") >> data_files
        concept_api >> Edge(label="Hosted on") >> aws_ec2
        concept_api >> Edge(label="Maps with") >> icd_api

    # Data Flow
    user >> Edge(label="Interacts with") >> cli
    user >> Edge(label="Interacts with") >> web
    user >> Edge(label="Interacts with") >> mobile

    cli >> Edge(label="API Calls") >> sync_api
    web >> Edge(label="API Calls") >> sync_api
    mobile >> Edge(label="API Calls") >> sync_api

    sync_api >> Edge(label="Authentication") >> auth_api
    sync_api >> Edge(label="Terminology Mapping") >> concept_api