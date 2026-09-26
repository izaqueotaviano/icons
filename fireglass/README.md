# FireGlass Launcher — APK

Launcher para Amazon Fire TV Stick 4K (Fire OS 6, 7 e 8). Versão 1.2.0.

**Download direto:** [FireGlass.apk](FireGlass.apk?raw=true)

## Instalar pelo Fire TV (app Downloader)

1. No Fire TV, instale o app **Downloader** (loja da Amazon).
2. **Configurações › Minha Fire TV › Opções do desenvolvedor › Instalar apps desconhecidos** →
   ative para o **Downloader**.
3. Abra o Downloader e digite o endereço:
   `https://github.com/izaqueotaviano/icons/raw/main/fireglass/FireGlass.apk`
4. Confirme **Instalar**. O FireGlass aparece em **Seus apps e canais**.

## Instalar por um computador (ADB)

```bash
adb connect IP_DO_FIRE_TV:5555
adb install -r FireGlass.apk
adb shell am start -n com.fireglass.launcher/.MainActivity
```

Nada no sistema é desativado ou removido; a Home da Amazon continua intacta.

SHA-256 do APK: `588b7a4827130a60116bed46d253683f33ed7cab50df9d2ca705050942a6b736`
