from google import genai
import os
from dotenv import load_dotenv

# Cargar variables del .env
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print("API KEY:", api_key)

# Crear cliente
client = genai.Client(api_key=api_key)

try:
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Hola, dime si estás funcionando correctamente"
    )

    print("\n✅ RESPUESTA:")
    print(response.text)

except Exception as e:
    print("\n❌ ERROR:")
    print(e)