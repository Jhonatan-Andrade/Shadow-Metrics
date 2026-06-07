**Passo 1: Download e Instalação**

1. Acesse o site oficial do Zabbix e baixe o instalador do **Zabbix Agent** (MSI) para Windows.
2. Execute o instalador. Durante o assistente, preencha os campos da seguinte forma:
   * **Host name:** Escolha um nome para identificar seu computador (ex: `Windows-Local`). *Importante: este nome deve ser idêntico ao que será cadastrado no painel web.*
   * **Zabbix server IP / DNS:** Insira o IP da sua máquina na rede local (ex: `192.168.1.50`).
   * **Agent listen port:** Mantenha a porta padrão `10050`.

---

**Passo 2: Ajustar o arquivo de configuração**

Caso precise alterar ou validar as configurações manualmente após a instalação, abra o arquivo `C:\Program Files\Zabbix Agent\zabbix_agentd.conf` como Administrador e verifique as seguintes linhas:

```ini
Server=IP_DA_SUA_MAQUINA_LOCAL
ServerActive=IP_DA_SUA_MAQUINA_LOCAL
Hostname=Windows-Local
```
---
**Passo 3: Liberar a porta no Firewall do Windows**

Para permitir que o container Docker do Zabbix Server consulte a porta do agente no Windows, execute o comando abaixo no Prompt de Comando (CMD) como Administrador:

```
netsh advfirewall firewall add rule name="Zabbix Agent" dir=in action=allow protocol=TCP localport=10050
```
**Passo 4: Reiniciar o Serviço**

Ainda no CMD como Administrador, reinicie o serviço para aplicar todas as alterações:

```
net stop "Zabbix Agent" && net start "Zabbix Agent"
```
**Passo 5: Cadastrar o Host no Zabbix Web**

1.Acesse o painel do Zabbix em http://localhost:8080.

2.Navegue até Monitoring ➡️ Hosts e clique em Create host (no canto superior direito).

3.Configuração do Host:
- Host name: Digite exatamente o mesmo nome configurado no Agent (ex: Windows-Local).
- Templates: Selecione Windows by Zabbix agent.
- Interfaces: Clique em Add ➡️ Agent.

    - No campo IP address, utilize o DNS especial do Docker Desktop para apontar para o Windows: host.docker.internal (ou insira o IP local da sua máquina).
    - Porta: 10050.
    
4.Clique em Add.

💡 Após um ou dois minutos, a tag ZBX ficará verde no painel do Zabbix, indicando que a comunicação foi estabelecida com sucesso e as métricas já estão disponíveis para o Shadow Metrics!