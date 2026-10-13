
CREATE TABLE grupo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE participante (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grupo_id INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  FOREIGN KEY (grupo_id) REFERENCES grupo(id) ON DELETE CASCADE
);

CREATE TABLE despesa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grupo_id INT NOT NULL,
  participante_pagador_id INT NOT NULL,
  descricao VARCHAR(100) NOT NULL,
  valor_centavos INT UNSIGNED NOT NULL,
  tipo_rateio VARCHAR(50) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (grupo_id) REFERENCES grupo(id) ON DELETE CASCADE,
  FOREIGN KEY (participante_pagador_id) REFERENCES participante(id)
);

CREATE TABLE parte_despesa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  despesa_id INT NOT NULL,
  participante_id INT NOT NULL,
  valor_centavos INT UNSIGNED NOT NULL,
  porcentagem DECIMAL(7,4) NULL,
  FOREIGN KEY (despesa_id) REFERENCES despesa(id) ON DELETE CASCADE,
  FOREIGN KEY (participante_id) REFERENCES participante(id),
  UNIQUE (despesa_id, participante_id)
);
